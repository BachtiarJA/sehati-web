<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Dokter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // 💡 FIX: Import ini wajib ada untuk transaksi database!
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 🌐 GET: Mengambil daftar dokter/khitan secara RIIL dari database
     */
    public function listDokter(Request $request)
    {
        $layanan = $request->query('layanan', 'dokter'); 
        $tanggalInput = $request->query('tanggal'); 
        
        $tanggal = $tanggalInput 
            ? Carbon::parse($tanggalInput)->toDateString() 
            : Carbon::today()->toDateString();

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

            $jadwal = \DB::table('jadwal_dokters')
                ->where('dokter_id', $doc->id)
                ->where('hari', 'like', '%' . $namaHari . '%')
                ->first();

            if ($jadwal && $jadwal->jam_mulai && $jadwal->jam_selesai) {
                $jamMulai = Carbon::parse($jadwal->jam_mulai)->format('H:i');
                $jamSelesai = Carbon::parse($jadwal->jam_selesai)->format('H:i');
            } else {
                $jamMulai = 'Libur';
                $jamSelesai = '';
            }

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
        $request->validate([
            'dokter_id' => 'required|exists:dokter,id',
            'tgl_kunjungan' => 'required|date',
        ]);

        $user = $request->user();
        $pasien = $user->pasien;

        if (!$pasien) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Profil pasien tidak ditemukan.'
            ], 404);
        }

        $isDoubleBooking = Antrian::where('pasien_id', $pasien->id)
            ->where('dokter_id', $request->dokter_id)
            ->whereDate('tgl_kunjungan', $request->tgl_kunjungan)
            ->where('status', 'menunggu')
            ->exists();

        if ($isDoubleBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah memiliki nomor antrean aktif untuk dokter ini pada tanggal tersebut.'
            ], 400);
        }

        try {
            return DB::transaction(function () use ($request, $pasien) {
                $tanggal = Carbon::parse($request->tgl_kunjungan)->toDateString();
                $namaHari = Carbon::parse($tanggal)->locale('id')->translatedFormat('l');

                $jadwal = DB::table('jadwal_dokters')
                    ->where('dokter_id', $request->dokter_id)
                    ->where('hari', 'like', '%' . $namaHari . '%')
                    ->first();

                $jamKunjungan = $jadwal ? $jadwal->jam_mulai : '08:00:00';

                $latestNoAntrian = Antrian::where('dokter_id', $request->dokter_id)
                    ->whereDate('tgl_kunjungan', $tanggal)
                    ->max('no_antrian');

                $noAntrianBaru = $latestNoAntrian ? $latestNoAntrian + 1 : 1;

                $antrian = Antrian::create([
                    'pasien_id' => $pasien->id,
                    'dokter_id' => $request->dokter_id,
                    'tgl_kunjungan' => $tanggal,
                    'jam_kunjungan' => $jamKunjungan,
                    'no_antrian' => $noAntrianBaru,
                    'status' => 'menunggu'
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Nomor antrean berhasil dipesan!',
                    'data' => [
                        'id_booking' => $antrian->id,
                        'no_antrian' => $antrian->no_antrian,
                        'jam_kunjungan' => Carbon::parse($antrian->jam_kunjungan)->format('H:i') . ' WIB'
                    ]
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage()
            ], 500);
        }
    }
}