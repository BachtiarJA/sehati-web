<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Dokter;
use App\Models\User;
use App\Models\Antrian; // Pastikan Anda memiliki model Antrian
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Carbon\Carbon;

class PendaftaranController extends Controller
{
    /**
     * Menampilkan halaman Pendaftaran & Antrean (GET)
     */
    public function index()
    {
        $hariIni = Carbon::today();

        // 1. Ambil data pasien beserta email DAN status antreannya HARI INI
        $pasiensData = Pasien::with([
            'akun',
            'antrians' => function ($query) use ($hariIni) {
                // Hanya cari antrean pasien yang jadwalnya hari ini dan statusnya belum selesai/batal
                $query->whereDate('tgl_kunjungan', $hariIni)
                    ->whereIn('status', ['menunggu', 'diperiksa']);
            }
        ])->orderBy('created_at', 'desc')->get();

        $pasiens = $pasiensData->map(function ($pasien) {
            // Cek apakah ada data antrean dari query di atas
            $antreanAktif = $pasien->antrians->first();

            return [
                'id' => $pasien->id,
                'user_id' => $pasien->user_id,
                'nama' => $pasien->nama,
                'jenis_kelamin' => $pasien->jenis_kelamin,
                'umur' => $pasien->umur,
                'alamat' => $pasien->alamat,
                'email' => $pasien->user ? $pasien->user->email : null,

                // Jika sudah antre, berikan kode/nomornya. Jika belum, biarkan null.
                // NOTE: Gunakan $antreanAktif->kode_antrian jika Anda menggunakan fitur Accessor (Cara 2) sebelumnya.
                // Jika tidak, ganti kode_antrian menjadi no_antrian.
                'antrean_hari_ini' => $antreanAktif ? ($antreanAktif->kode_antrian ?? $antreanAktif->no_antrian) : null,
            ];
        });

        // 2. Ambil data dokter untuk pilihan dropdown di Form Antrean
        $dokters = Dokter::orderBy('nama_dokter', 'asc')->get();

        // 3. Kirim ke React Frontend
        return Inertia::render('admin/pendaftaran-pasien', [
            'pasiens' => $pasiens,
            'dokters' => $dokters
        ]);
    }

    /**
     * Memproses form Pendaftaran Pasien Baru (POST)
     */
    public function buatAkunPasien(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'umur' => 'required|numeric|min:0',
            'alamat' => 'required|string',
        ]);

        // 2. Simpan ke 2 Tabel menggunakan DB Transaction
        DB::transaction(function () use ($request) {
            // Buat akun login (tabel users)
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'pasien', // Otomatis menjadi role pasien
            ]);

            // Buat profil pasien (tabel pasiens)
            Pasien::create([
                'user_id' => $user->id,
                'nama' => $request->nama,
                'jenis_kelamin' => $request->jenis_kelamin,
                'umur' => $request->umur,
                'alamat' => $request->alamat,
            ]);
        });

        return redirect()->back();
    }

    /**
     * Memproses form Masukkan Pasien ke Antrean (POST)
     */
    public function tambahAntrian(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'pasien_id' => 'required|exists:pasiens,id',
            'dokter_id' => 'required', // Sesuaikan validasinya dengan nama tabel dokter Anda
            'poli' => 'required|string',
        ]);

        $hariIni = \Carbon\Carbon::today();

        // 2. LOGIKA GENERATE NOMOR ANTRIAN (ANGKA MURNI)
        // Cari angka antrean paling besar (max) pada hari ini untuk dokter tersebut
        $antrianTerakhir = Antrian::where('dokter_id', $request->dokter_id)
            ->whereDate('tgl_kunjungan', $hariIni)
            ->max('no_antrian');

        // Jika sudah ada antrean, tambah 1. Jika belum ada, mulai dari 1.
        $nomorBaru = $antrianTerakhir ? $antrianTerakhir + 1 : 1;

        // 3. Simpan data ke tabel antrians
        Antrian::create([
            'pasien_id' => $request->pasien_id,
            'dokter_id' => $request->dokter_id,
            'poli' => $request->poli,
            'tgl_kunjungan' => $hariIni,
            'no_antrian' => $nomorBaru, // <--- Berupa Angka (Integer)
            'status' => 'menunggu',
        ]);

        return redirect()->back();
    }
}
