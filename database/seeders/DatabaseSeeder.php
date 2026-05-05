<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Antrian;
use App\Models\Pemeriksaan;
use App\Models\ResepObat;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Klinik',
            'email' => 'admin@klinik.com',
            'password' => Hash::make('password'),
            'role' => 'admin', // Role baru
        ]);
        // ==========================================
        // 1. BUAT AKUN & PROFIL DOKTER
        // ==========================================
        $userDokter = User::create([
            'name' => 'dr. Budi Santoso',
            'email' => 'dokter@klinik.com',
            'password' => Hash::make('password'),
            'role' => 'dokter',
        ]);

        $dokter = Dokter::create([
            'user_id' => $userDokter->id,
            'nama_dokter' => 'dr. Budi Santoso',
            'keahlian' => 'Umum',
            'no_str' => 'STR-123456789',
            'no_telp' => '081234567890',
        ]);

        // ==========================================
        // 2. BUAT AKUN & PROFIL PASIEN (3 Orang)
        // ==========================================
        $pasiens = [];
        $namaPasien = ['Andi Saputra', 'Siti Aminah', 'Bagas Dwi'];
        $jk = ['Laki-laki', 'Perempuan', 'Laki-laki'];

        for ($i = 0; $i < 3; $i++) {
            $userPasien = User::create([
                'name' => $namaPasien[$i],
                'email' => 'pasien' . ($i + 1) . '@gmail.com', // pasien1@gmail.com, dst
                'password' => Hash::make('password'),
                'role' => 'pasien',
            ]);

            $pasiens[] = Pasien::create([
                'user_id' => $userPasien->id,
                'nama' => $namaPasien[$i],
                'jenis_kelamin' => $jk[$i],
                'umur' => 25 + $i,
                'alamat' => 'Jl. Merdeka No. ' . ($i + 1),
            ]);
        }

        // ==========================================
        // 3. BUAT DATA ANTRIAN HARI INI
        // ==========================================
        $hariIni = Carbon::today();

        // A. Pasien 1: Status "Selesai"
        $antrianSelesai = Antrian::create([
            'pasien_id' => $pasiens[0]->id,
            'dokter_id' => $dokter->id,
            'tgl_kunjungan' => $hariIni,
            'no_antrian' => 1,
            'status' => 'selesai',
        ]);

        // B. Pasien 2 & 3: Status "Menunggu"
        Antrian::create([
            'pasien_id' => $pasiens[1]->id,
            'dokter_id' => $dokter->id,
            'tgl_kunjungan' => $hariIni,
            'no_antrian' => 2,
            'status' => 'menunggu',
        ]);

        Antrian::create([
            'pasien_id' => $pasiens[2]->id,
            'dokter_id' => $dokter->id,
            'tgl_kunjungan' => $hariIni,
            'no_antrian' => 3,
            'status' => 'menunggu',
        ]);

        // ==========================================
        // 4. BUAT PEMERIKSAAN & RESEP (Untuk Pasien Selesai)
        // ==========================================
        $pemeriksaan = Pemeriksaan::create([
            'antrian_id' => $antrianSelesai->id,
            'keluhan' => 'Demam tinggi dan sakit kepala sejak 2 hari lalu.',
            'diagnosa' => 'Gejala Tifus',
            'tindakan' => 'Pemeriksaan fisik dan pemberian resep obat jalan.',
        ]);

        ResepObat::create([
            'pemeriksaan_id' => $pemeriksaan->id,
            'nama_obat' => 'Paracetamol',
            'dosis' => '500mg',
            'aturan' => 'Sesudah Makan',
            'berapa_kali' => 3,
            'waktu' => ['08:00', '13:00', '20:00'], // Akan otomatis di-convert ke JSON
        ]);

        // ==========================================
        // 5. BUAT DATA ANTRIAN MASA LALU (Untuk Simulasi Grafik)
        // ==========================================
        // Membuat random pasien dalam 6 hari ke belakang agar grafik di dashboard terisi
        for ($i = 1; $i <= 6; $i++) {
            $tglMundur = Carbon::today()->subDays($i);
            $jumlahPasienAcak = rand(5, 20); // Acak antara 5 sampai 20 pasien per hari

            for ($j = 0; $j < $jumlahPasienAcak; $j++) {
                Antrian::create([
                    'pasien_id' => $pasiens[rand(0, 2)]->id, // Acak pakai data pasien yg ada
                    'dokter_id' => $dokter->id,
                    'tgl_kunjungan' => $tglMundur,
                    'no_antrian' => $j + 1,
                    'status' => 'selesai',
                ]);
            }
        }
    }
}
