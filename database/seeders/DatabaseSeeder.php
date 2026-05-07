<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Antrian;
use App\Models\Pemeriksaan;
use App\Models\ResepObat;
use App\Models\Obat; // Tambahan Import Model Obat
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
            'role' => 'admin',
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
                'email' => 'pasien' . ($i + 1) . '@gmail.com',
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
        // 3. BUAT DATA MASTER OBAT (BARU)
        // ==========================================
        $obat1 = Obat::create([
            'kode_obat' => 'OBT-001',
            'nama_obat' => 'Paracetamol 500mg',
            'kategori' => 'Analgesik',
            'jenis' => 'tablet',
        ]);

        $obat2 = Obat::create([
            'kode_obat' => 'OBT-002',
            'nama_obat' => 'Amoxicillin 500mg',
            'kategori' => 'Antibiotik',
            'jenis' => 'kapsul',
        ]);

        // ==========================================
        // 4. BUAT DATA ANTRIAN HARI INI
        // ==========================================
        $hariIni = Carbon::today();

        $antrianSelesai = Antrian::create([
            'pasien_id' => $pasiens[0]->id,
            'dokter_id' => $dokter->id,
            'tgl_kunjungan' => $hariIni,
            'no_antrian' => 1,
            'status' => 'selesai',
        ]);

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
        // 5. BUAT PEMERIKSAAN & RESEP OBAT (DIUPDATE)
        // ==========================================
        $pemeriksaan = Pemeriksaan::create([
            'antrian_id' => $antrianSelesai->id,
            'keluhan' => 'Demam tinggi dan sakit kepala sejak 2 hari lalu.',
            'diagnosa' => 'Gejala Tifus',
            'tindakan' => 'Pemeriksaan fisik dan pemberian resep obat jalan.',
        ]);

        // Perbaikan struktur Resep Obat sesuai migrasi terbaru
        ResepObat::create([
            'pasien_id' => $pasiens[0]->id,        // Kolom Baru
            'pemeriksaan_id' => $pemeriksaan->id,
            'obat_id' => $obat1->id,               // Menggunakan obat_id (Paracetamol)
            'dosis' => '500mg',
            'jumlah' => 10,                        // Kolom Baru
            'berapa_kali' => '3 x Sehari',         // Diubah menjadi tipe string
            'waktu' => json_encode(['08:00', '13:00', '20:00']), // Disimpan sebagai JSON untuk alarm
            'berapa_hari' => 3,                    // Kolom Baru
            'status_alarm' => 'aktif',             // Kolom Baru
            'keterangan' => 'Diminum sesudah makan' // Pengganti kolom aturan
        ]);

        // ==========================================
        // 6. BUAT DATA ANTRIAN MASA LALU
        // ==========================================
        for ($i = 1; $i <= 6; $i++) {
            $tglMundur = Carbon::today()->subDays($i);
            $jumlahPasienAcak = rand(5, 20);

            for ($j = 0; $j < $jumlahPasienAcak; $j++) {
                Antrian::create([
                    'pasien_id' => $pasiens[rand(0, 2)]->id,
                    'dokter_id' => $dokter->id,
                    'tgl_kunjungan' => $tglMundur,
                    'no_antrian' => $j + 1,
                    'status' => 'selesai',
                ]);
            }
        }
    }
}
