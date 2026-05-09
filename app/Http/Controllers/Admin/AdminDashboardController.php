<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Antrian;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung Total Pasien
        $totalPasien = Pasien::count();

        $totalDokter = User::where('role', 'dokter')->count();

        // 3. Kunjungan dan Antrean Hari Ini
        $hariIni = Carbon::today();
        $kunjunganHariIni = Antrian::whereDate('tgl_kunjungan', $hariIni)->count();
        $antreanTersisa = Antrian::whereDate('tgl_kunjungan', $hariIni)
                                 ->where('status', 'menunggu')
                                 ->count();

        // 4. Data Statistik Kunjungan 7 Hari Terakhir untuk Grafik (Recharts)
        $visitData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Antrian::whereDate('tgl_kunjungan', $date)->count();

            $visitData[] = [
                // translatedFormat('l') akan menghasilkan nama hari lokal (Senin, Selasa, dst)
                'name' => $date->translatedFormat('l'),
                'pasien' => $count
            ];
        }

        // 5. Data Dokter Bertugas (Ambil semua/sebagian dokter dari database)
        $dokterBertugas = User::where('role', 'dokter')
            ->take(5)
            ->get()
            ->map(function ($dokter) {
                return [
                    'name' => $dokter->name,
                    'spec' => $dokter->spesialisasi ?? 'Dokter Umum', // Sesuaikan dengan kolom tabel Anda
                    'time' => '08:00 - 15:00' // Statis atau bisa diambil dari tabel jadwal
                ];
            });

        return Inertia::render('admin/dashboard', [
            'totalPasien' => $totalPasien,
            'totalDokter' => $totalDokter,
            'kunjunganHariIni' => $kunjunganHariIni,
            'antreanTersisa' => $antreanTersisa,
            'visitData' => $visitData,
            'dokterBertugas' => $dokterBertugas,
        ]);
    }
}
