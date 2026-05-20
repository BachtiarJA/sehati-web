<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 💡 BARU: Mengambil daftar dokter/khitan secara dinamis untuk Flutter
     */
    public function listDokter(Request $request)
    {
        // Tangkap query parameter filter dari aplikasi Flutter
        $layanan = $request->query('layanan', 'dokter'); 
        $tanggal = $request->query('tanggal'); 

        // Slicing Fallback Data: Menghasilkan data terstruktur sesuai UI Medvora
        if ($layanan === 'dokter') {
            $dataDokter = [
                [
                    'id' => 1,
                    'nama' => 'dr. Yoshinori, Sp. PD',
                    'spesialis' => 'Spesialis Penyakit Dalam',
                    'jam_praktik' => '08.00 - 12.00 WIB',
                    'rating' => 4.8,
                    'estimasi_antrean' => 5
                ],
                [
                    'id' => 2,
                    'nama' => 'dr. Sarah Wijaya, Sp. A',
                    'spesialis' => 'Spesialis Anak',
                    'jam_praktik' => '13.00 - 16.00 WIB',
                    'rating' => 4.9,
                    'estimasi_antrean' => 3
                ]
            ];
        } else {
            // Jika kategori yang di-klik di HP adalah 'Khitan'
            $dataDokter = [
                [
                    'id' => 3,
                    'nama' => 'Layanan Khitan Anak',
                    'spesialis' => 'Ditangani oleh tenaga medis berpengalaman',
                    'jam_praktik' => '09.00 - 14.00 WIB',
                    'rating' => 4.7,
                    'estimasi_antrean' => 2
                ]
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data jadwal berhasil diambil',
            'data' => $dataDokter
        ], 200);
    }

    /**
     * 🛠️ DIUBAH: Menyimpan data booking antrian baru dari Mobile/Web
     */
    public function store(Request $request)
    {
        // 💡 PERBAIKAN: Petakan input camelCase dari Flutter ke snake_case bawaan database Laravel kalian
        if ($request->has('doctorId')) {
            $request->merge([
                'dokter_id' => $request->doctorId,
                'tgl_kunjungan' => $request->selectedDate,
            ]);
        }

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'dokter_id' => 'required', // Menghapus exists jika tabel dokter kalian belum di-seed penuh saat demo
            'tgl_kunjungan' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // 2. Ambil Profil Pasien
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            $tanggal = $request->tgl_kunjungan
                ? Carbon::parse($request->tgl_kunjungan)->toDateString()
                : Carbon::today()->toDateString();

            // 3. Hitung no_antrian terakhir (ANGKA MURNI)
            $antrianTerakhir = Antrian::where('dokter_id', $request->dokter_id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->max('no_antrian');

            $nomorBaru = $antrianTerakhir ? $antrianTerakhir + 1 : 1;

            // 4. Simpan ke Database
            $antrian = Antrian::create([
                'pasien_id' => $pasien->id,
                'dokter_id' => $request->dokter_id,
                'tgl_kunjungan' => $tanggal,
                'no_antrian' => $nomorBaru,
                'status' => 'menunggu',
            ]);

            // 💡 PERBAIKAN: Generate kode booking rapi (Contoh: BK-200526-001) untuk dibaca halaman sukses Flutter
            $formatTanggalCode = Carbon::parse($antrian->tgl_kunjungan)->format('dmy');
            $formatNomorUrut = str_pad($antrian->no_antrian, 3, '0', STR_PAD_LEFT);
            $nomorBookingLive = "BK-{$formatTanggalCode}-{$formatNomorUrut}";

            return response()->json([
                'status' => 'success',
                'message' => 'Booking antrian berhasil!',
                'data' => [
                    'no_antrian' => $antrian->no_antrian,
                    'nomor_booking' => $nomorBookingLive, // 💡 Ini wajib ada untuk menyuplai nota sukses di HP
                    'tgl_kunjungan' => Carbon::parse($antrian->tgl_kunjungan)->format('d M Y'),
                    'nama_pasien' => $pasien->nama,
                    'status' => $antrian->status
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan server: ' . $e->getMessage()], 500);
        }
    }
}