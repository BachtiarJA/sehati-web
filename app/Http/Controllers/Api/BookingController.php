<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Dokter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 🌐 GET: Mengambil daftar dokter/khitan secara RIIL dari database (UPDATE ERD JAM KERJA)
     */
    public function listDokter(Request $request)
    {
        $layanan = $request->query('layanan', 'dokter'); 
        $tanggalInput = $request->query('tanggal'); 
        
        $tanggal = $tanggalInput 
            ? Carbon::parse($tanggalInput)->toDateString() 
            : Carbon::today()->toDateString();

        // 💡 1. Dapatkan nama hari kunjungan dalam bahasa Indonesia (Contoh: "Senin", "Selasa")
        $namaHari = Carbon::parse($tanggal)->locale('id')->translatedFormat('l');

        $query = Dokter::query();

        if ($layanan === 'khitan') {
            $query->where('keahlian', 'like', '%khitan%');
        } else {
            $query->where('keahlian', 'not like', '%khitan%');
        }

        $daftarDokter = $query->get();

        $dataDokterResponse = $daftarDokter->map(function ($doc) use ($tanggal, $namaHari) {
            
            $estimasiAntrean = Antrian::where('dokter_id', $doc->id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->where('status', 'menunggu')
                ->count();

            // 💡 2. Cari jadwal yang dokter_id-nya COCOK dan HARI-nya sesuai dengan kalender HP
            $jadwal = \DB::table('jadwal_dokters')
                ->where('dokter_id', $doc->id)
                ->where('hari', 'like', '%' . $namaHari . '%')
                ->first();

            // Fallback: Jika tidak ada jadwal spesifik hari itu, ambil jadwal pertama yang tersedia
            if (!$jadwal) {
                $jadwal = \DB::table('jadwal_dokters')
                    ->where('dokter_id', $doc->id)
                    ->first();
            }

            // 💡 3. FIX ANTI-JAM-LAPTOP: Pastikan nilainya benar-benar ada di DB sebelum di-parse Carbon
            $jamMulai = ($jadwal && $jadwal->jam_mulai) ? Carbon::parse($jadwal->jam_mulai)->format('H:i') : '08:00';
            $jamSelesai = ($jadwal && $jadwal->jam_selesai) ? Carbon::parse($jadwal->jam_selesai)->format('H:i') : '14:00';

            return [
                'id' => $doc->id,
                'nama' => $doc->nama_dokter, 
                'spesialis' => $doc->keahlian, 
                'jam_mulai' => $jamMulai,     
                'jam_selesai' => $jamSelesai, 
                'estimasi_antrean' => $estimasiAntrean 
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data jadwal dokter berhasil diambil secara riil',
            'data' => $dataDokterResponse
        ], 200);
    }

    /**
     * 📥 POST: Menyimpan transaksi booking antrian baru ke database
     */
    public function store(Request $request)
    {
        if ($request->has('doctorId')) {
            $request->merge([
                'dokter_id' => $request->doctorId,
                'tgl_kunjungan' => $request->selectedDate,
                'jam_kunjungan' => $request->selectedTime, 
            ]);
        }

        $validator = Validator::make($request->all(), [
            'dokter_id' => 'required|exists:dokter,id', 
            'tgl_kunjungan' => 'required|date',
            'jam_kunjungan' => 'required', 
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            $tanggal = Carbon::parse($request->tgl_kunjungan)->toDateString();

            // Perbaikan format jam agar ramah database waktu (Contoh: "08.30 WIB" -> "08:30")
            $jamClean = str_replace([' WIB', '.'], ['', ':'], $request->jam_kunjungan);

            $antrianTerakhir = Antrian::where('dokter_id', $request->dokter_id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->max('no_antrian');

            $nomorBaru = $antrianTerakhir ? $antrianTerakhir + 1 : 1;

            $antrian = Antrian::create([
                'pasien_id' => $pasien->id,       
                'dokter_id' => $request->dokter_id, 
                'tgl_kunjungan' => $tanggal,
                'jam_kunjungan' => $jamClean, 
                'no_antrian' => $nomorBaru,
                'status' => 'menunggu',
            ]);

            $formatTanggalCode = Carbon::parse($antrian->tgl_kunjungan)->format('dmy');
            $formatNomorUrut = str_pad($antrian->no_antrian, 3, '0', STR_PAD_LEFT);
            $nomorBookingLive = "BK-{$formatTanggalCode}-{$formatNomorUrut}";

            return response()->json([
                'status' => 'success',
                'message' => 'Booking antrian berhasil disimpan ke database!',
                'data' => [
                    'no_antrian' => $antrian->no_antrian,
                    'nomor_booking' => $nomorBookingLive, 
                    'tgl_kunjungan' => Carbon::parse($antrian->tgl_kunjungan)->format('d M Y'),
                    'jam_kunjungan' => $antrian->jam_kunjungan,
                    'nama_pasien' => $pasien->nama, 
                    'status' => $antrian->status
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan server: ' . $e->getMessage()], 500);
        }
    }
}