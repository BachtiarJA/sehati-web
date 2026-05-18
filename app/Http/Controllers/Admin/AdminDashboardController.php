<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Antrian;
use App\Models\User;
use App\Models\JadwalDokter; // <--- PASTIKAN INI DI-IMPORT
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung Total Pasien & Dokter
        $totalPasien = Pasien::count();
        $totalDokter = User::where('role', 'dokter')->count();

        // 2. Kunjungan dan Antrean Hari Ini
        $hariIni = Carbon::today();
        $kunjunganHariIni = Antrian::whereDate('tgl_kunjungan', $hariIni)->count();
        $antreanTersisa = Antrian::whereDate('tgl_kunjungan', $hariIni)
            ->where('status', 'menunggu')
            ->count();

        // 3. Data Statistik Kunjungan 7 Hari Terakhir
        $visitData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Antrian::whereDate('tgl_kunjungan', $date)->count();

            $visitData[] = [
                'name' => $date->translatedFormat('l'),
                'pasien' => $count
            ];
        }

        // 4. Data Dokter Bertugas DINAMIS Berdasarkan Tabel Jadwal
        // Cari nama hari ini dalam bahasa Indonesia
        $hariInggris = Carbon::today()->format('l');
        $mapHari = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu'
        ];
        $namaHariIni = $mapHari[$hariInggris];

        // Cari jadwal yang aktif hari ini, lalu load relasi dokter-nya
        $dokterBertugas = JadwalDokter::with('dokter')
            ->where('hari', $namaHariIni)
            ->where('is_aktif', true)
            ->get()
            ->map(function ($jadwal) {
                // Format jam (misal dari "08:00:00" menjadi "08:00")
                $jamMulai = Carbon::parse($jadwal->jam_mulai)->format('H:i');
                $jamSelesai = Carbon::parse($jadwal->jam_selesai)->format('H:i');

                return [
                    'name' => 'dr. ' . $jadwal->dokter->nama_dokter, // Ambil dari tabel Dokter
                    'spec' => 'Poli ' . $jadwal->dokter->keahlian,   // Ambil dari tabel Dokter
                    'time' => $jamMulai . ' - ' . $jamSelesai        // Jam dinamis dari tabel Jadwal
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
