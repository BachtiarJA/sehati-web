<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JadwalMinumObat;
use Carbon\Carbon;

class JadwalMinumObatSeeder extends Seeder
{
    public function run(): void
    {
        // Misalkan kita buat jadwal untuk Pemeriksaan ID 1
        $pemeriksaan_id = 1;

        $hariIni = Carbon::today();

        // Data Jadwal Hari Ini
        $jadwal = [
            ['waktu_jadwal' => $hariIni->copy()->setTime(8, 0), 'status' => 'sudah', 'waktu_aktual' => $hariIni->copy()->setTime(8, 15)], // Pagi (Sudah diminum jam 08:15)
            ['waktu_jadwal' => $hariIni->copy()->setTime(13, 0), 'status' => 'belum', 'waktu_aktual' => null], // Siang (Belum waktunya / Belum diminum)
            ['waktu_jadwal' => $hariIni->copy()->setTime(20, 0), 'status' => 'belum', 'waktu_aktual' => null], // Malam

            // Jadwal Besok
            ['waktu_jadwal' => $hariIni->copy()->addDay()->setTime(8, 0), 'status' => 'belum', 'waktu_aktual' => null],
            ['waktu_jadwal' => $hariIni->copy()->addDay()->setTime(13, 0), 'status' => 'belum', 'waktu_aktual' => null],
            ['waktu_jadwal' => $hariIni->copy()->addDay()->setTime(20, 0), 'status' => 'belum', 'waktu_aktual' => null],
        ];

        foreach ($jadwal as $j) {
            JadwalMinumObat::create([
                'pemeriksaan_id' => $pemeriksaan_id,
                'waktu_jadwal' => $j['waktu_jadwal'],
                'waktu_aktual' => $j['waktu_aktual'],
                'status' => $j['status']
            ]);
        }
    }
}
