<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalMinumObat;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalObatController extends Controller
{
    /**
     * Mengambil daftar jadwal minum obat pasien HARI INI
     */
    public function hariIni(Request $request)
    {
        $pasien = $request->user()->pasien;

        if (!$pasien) {
            return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
        }

        // Cari jadwal HARI INI milik pasien tersebut
        $jadwalHariIni = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
            ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                // Pastikan jadwal ini benar-benar milik pasien yang sedang login
                $query->where('pasien_id', $pasien->id);
            })
            ->whereDate('waktu_jadwal', Carbon::today())
            ->orderBy('waktu_jadwal', 'asc')
            ->get();

        // Format data agar mudah dibaca oleh Frontend Developer (Mobile App)
        $data = $jadwalHariIni->map(function ($jadwal) {
            // Ambil semua nama obat dari resep pada pemeriksaan tersebut
            $daftarObat = $jadwal->pemeriksaan->resepObats->map(function ($resep) {
                return $resep->obat->nama_obat . ' (' . $resep->dosis . ')';
            })->implode(', ');

            return [
                'id_jadwal' => $jadwal->id,
                'jam_minum' => $jadwal->waktu_jadwal->format('H:i'), // Contoh: "08:00"
                'daftar_obat' => $daftarObat, // Contoh: "Paracetamol (500mg), Amoxicillin (500mg)"
                'status' => $jadwal->status, // "belum", "sudah", atau "terlewat"
                'waktu_diminum' => $jadwal->waktu_aktual ? $jadwal->waktu_aktual->format('H:i') : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal hari ini berhasil diambil',
            'data' => $data
        ], 200);
    }

    /**
     * Memproses ketika pasien menekan tombol "SAYA SUDAH MINUM"
     */
    public function tandaiSudahMinum(Request $request, $id_jadwal)
    {
        $pasien = $request->user()->pasien;

        // Cari jadwal berdasarkan ID dan pastikan itu milik pasien yang login
        $jadwal = JadwalMinumObat::whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                $query->where('pasien_id', $pasien->id);
            })->find($id_jadwal);

        if (!$jadwal) {
            return response()->json(['status' => 'error', 'message' => 'Jadwal tidak ditemukan atau akses ditolak.'], 404);
        }

        if ($jadwal->status === 'sudah') {
            return response()->json(['status' => 'error', 'message' => 'Obat ini sudah ditandai diminum sebelumnya.'], 400);
        }

        // Update database: Tandai sudah diminum dan catat jam berapanya
        $jadwal->update([
            'status' => 'sudah',
            'waktu_aktual' => now() // Menyimpan waktu real-time pasien klik tombol
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hebat! Anda telah meminum obat tepat waktu.',
            'waktu_diminum' => $jadwal->waktu_aktual->format('H:i')
        ], 200);
    }
}
