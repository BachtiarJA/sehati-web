<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'dokter_id' => 'required|exists:dokter,id',
            'tgl_kunjungan' => 'nullable|date|after_or_equal:today',
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

            // =====================================================================
            // BLOK KODE PENGECEKAN (SUDAH DAFTAR) DIHAPUS/DINONAKTIFKAN DI SINI
            // =====================================================================

            // 3. Hitung no_antrian terakhir di hari tersebut
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

            return response()->json([
                'status' => 'success',
                'message' => 'Booking antrian berhasil!',
                'data' => [
                    'no_antrian' => $antrian->no_antrian,
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
