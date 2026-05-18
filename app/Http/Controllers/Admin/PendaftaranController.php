<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Dokter;
use App\Models\User;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Carbon\Carbon;

class PendaftaranController extends Controller
{
    public function index()
    {
        $hariIni = Carbon::today();

        // 1. Ambil data pasien (Sama seperti sebelumnya)
        $pasiensData = Pasien::with([
            'akun',
            'antrians' => function ($query) use ($hariIni) {
                $query->whereDate('tgl_kunjungan', $hariIni)
                    ->whereIn('status', ['menunggu', 'diperiksa']);
            }
        ])->orderBy('created_at', 'desc')->get();

        $pasiens = $pasiensData->map(function ($pasien) {
            $antreanAktif = $pasien->antrians->first();
            return [
                'id' => $pasien->id,
                'user_id' => $pasien->user_id,
                'nama' => $pasien->nama,
                'jenis_kelamin' => $pasien->jenis_kelamin,
                'umur' => $pasien->umur,
                'alamat' => $pasien->alamat,
                'email' => $pasien->user ? $pasien->user->email : null,
                'antrean_hari_ini' => $antreanAktif && $antreanAktif->jam_kunjungan
                    ? Carbon::parse($antreanAktif->jam_kunjungan)->format('H:i')
                    : null,
            ];
        });

        $dokters = Dokter::orderBy('nama_dokter', 'asc')->get();

        // 2. Ambil data Antrean KHUSUS HARI INI dan urutkan berdasarkan JAM
        $antreans = Antrian::with(['pasien', 'dokter'])
            ->whereDate('tgl_kunjungan', $hariIni)
            ->orderBy('jam_kunjungan', 'asc')
            ->get()
            ->map(function ($antrian) {
                return [
                    'id' => $antrian->id,
                    'dokter_id' => $antrian->dokter_id,
                    'nama_pasien' => $antrian->pasien->nama,
                    'nama_dokter' => $antrian->dokter->nama_dokter,

                    // [PERBAIKAN] Ambil nama poli langsung dari keahlian dokternya
                    // Sehingga meskipun data lama, poliklinik akan tetap muncul otomatis!
                    'poli' => 'Poli ' . $antrian->dokter->keahlian,

                    'jam_kunjungan' => Carbon::parse($antrian->jam_kunjungan)->format('H:i'),
                    'status' => $antrian->status,
                ];
            });
        return Inertia::render('admin/pendaftaran-pasien', [
            'pasiens' => $pasiens,
            'dokters' => $dokters,
            'antreans' => $antreans // <--- Kirim data antrean ke React
        ]);
    }
    public function buatAkunPasien(Request $request)
    {
        // ... (KODE INIT TETAP SAMA SEPERTI MILIK ANDA) ...
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'umur' => 'required|numeric|min:0',
            'alamat' => 'required|string',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'pasien',
            ]);

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

    public function tambahAntrian(Request $request)
    {
        $request->validate([
            'pasien_id' => 'required|exists:pasiens,id',
            'dokter_id' => 'required',
            'poli' => 'required|string',
            'tgl_kunjungan' => 'required|date',
            'jam_kunjungan' => 'required|date_format:H:i',
        ]);

        $tanggal = Carbon::parse($request->tgl_kunjungan)->toDateString();
        $jamSlot = $request->jam_kunjungan . ':00';

        // ==========================================================
        // 1. CARI JADWAL DOKTER HARI INI
        // ==========================================================
        $hariInggris = Carbon::parse($tanggal)->format('l');
        $mapHari = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu'
        ];
        $namaHari = $mapHari[$hariInggris];

        $jadwalDokter = \App\Models\JadwalDokter::where('dokter_id', $request->dokter_id)
            ->where('hari', $namaHari)
            ->first();

        // 🛑 VALIDASI 1: Apakah dokter libur / tidak ada jadwal?
        if (!$jadwalDokter || !$jadwalDokter->is_aktif) {
            return back()->withErrors([
                // Kita kirim error ke field jam atau tgl agar muncul di form
                'tgl_kunjungan' => "Maaf, Dokter tidak memiliki jadwal praktek (LIBUR) pada hari $namaHari."
            ]);
        }

        // 🛑 VALIDASI 2: Apakah jam yang dipilih di luar jam kerja dokter?
        $jamInput = Carbon::parse($jamSlot);
        $jamMulaiPraktek = Carbon::parse($jadwalDokter->jam_mulai);
        $jamSelesaiPraktek = Carbon::parse($jadwalDokter->jam_selesai);

        // Jika jam input lebih kecil dari jam mulai, ATAU jam input melebihi batas jam selesai
        if ($jamInput->lt($jamMulaiPraktek) || $jamInput->gte($jamSelesaiPraktek)) {
            return back()->withErrors([
                'jam_kunjungan' => "Jam sesi di luar jadwal praktek! Dokter ini hanya bertugas jam " .
                    $jamMulaiPraktek->format('H:i') . " sampai " . $jamSelesaiPraktek->format('H:i') . "."
            ]);
        }

        $durasi = $jadwalDokter->durasi_per_pasien;

        // ==========================================================
        // 2. CEK TABRAKAN JADWAL DENGAN PASIEN LAIN
        // ==========================================================
        $mulaiBaru = Carbon::parse($tanggal . ' ' . $jamSlot);
        $selesaiBaru = $mulaiBaru->copy()->addMinutes($durasi);

        $antrianHariIni = Antrian::where('dokter_id', $request->dokter_id)
            ->whereDate('tgl_kunjungan', $tanggal)
            ->whereIn('status', ['menunggu', 'diperiksa'])
            ->get();

        $isBentrok = false;
        foreach ($antrianHariIni as $antrianLama) {
            $mulaiLama = Carbon::parse($antrianLama->tgl_kunjungan . ' ' . $antrianLama->jam_kunjungan);
            $selesaiLama = $mulaiLama->copy()->addMinutes($durasi);

            if ($mulaiBaru < $selesaiLama && $selesaiBaru > $mulaiLama) {
                $isBentrok = true;
                break;
            }
        }

        if ($isBentrok) {
            return back()->withErrors([
                'jam_kunjungan' => "Waktu bertabrakan! Jam $request->jam_kunjungan memotong jadwal pasien lain. (Durasi pemeriksaan: $durasi menit)."
            ]);
        }

        // ==========================================================
        // 3. JIKA SEMUA AMAN, SIMPAN KE DATABASE
        // ==========================================================
        Antrian::create([
            'pasien_id' => $request->pasien_id,
            'dokter_id' => $request->dokter_id,
            'poli' => $request->poli,
            'tgl_kunjungan' => $tanggal,
            'jam_kunjungan' => $jamSlot,
            'no_antrian' => 0,
            'status' => 'menunggu',
        ]);

        return redirect()->back();
    }
}
