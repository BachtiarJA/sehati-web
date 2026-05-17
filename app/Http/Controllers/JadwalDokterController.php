<?php

namespace App\Http\Controllers;

use App\Models\JadwalDokter;
use App\Models\Dokter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalDokterController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil data user yang sedang login
        $user = $request->user();

        // 2. Ambil profil dokter yang terhubung dengan akun user ini
        $dokter = $user->dokter;

        // Cegah error jika yang login bukan dokter (misal Admin/Pasien nyasar ke halaman ini)
        if (!$dokter) {
            abort(403, 'Akses ditolak. Akun Anda tidak terdaftar sebagai Dokter.');
        }

        $dokter_id = $dokter->id;

        $hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        $jadwalResponse = [];

        foreach ($hariList as $hari) {
            // Cari jadwal dokter TERSEBUT pada hari ini
            $jadwal = JadwalDokter::where('dokter_id', $dokter_id)->where('hari', $hari)->first();

            $jadwalResponse[] = [
                'hari' => $hari,
                'is_aktif' => $jadwal ? (bool) $jadwal->is_aktif : false,
                'jam_mulai' => $jadwal && $jadwal->jam_mulai ? \Carbon\Carbon::parse($jadwal->jam_mulai)->format('H:i') : '08:00',
                'jam_selesai' => $jadwal && $jadwal->jam_selesai ? \Carbon\Carbon::parse($jadwal->jam_selesai)->format('H:i') : '12:00',
                'durasi_per_pasien' => $jadwal ? $jadwal->durasi_per_pasien : 15,
            ];
        }

        return Inertia::render('jadwal-praktek', [
            'dokter' => $dokter,
            'jadwal' => $jadwalResponse
        ]);
    }

    public function store(Request $request)
    {
        // 1. Ambil data user yang sedang login
        $user = $request->user();
        $dokter = $user->dokter;

        if (!$dokter) {
            abort(403, 'Akses ditolak.');
        }

        $dokter_id = $dokter->id;

        // 2. Looping data jadwal yang dikirim dari React dan simpan untuk DOKTER INI
        foreach ($request->jadwal as $j) {
            JadwalDokter::updateOrCreate(
                // Kondisi pencarian: Jadwal milik dokter yang login di Hari Y
                ['dokter_id' => $dokter_id, 'hari' => $j['hari']],
                // Data yang diupdate/disimpan
                [
                    'is_aktif' => $j['is_aktif'],
                    'jam_mulai' => $j['is_aktif'] ? $j['jam_mulai'] : null,
                    'jam_selesai' => $j['is_aktif'] ? $j['jam_selesai'] : null,
                    'durasi_per_pasien' => $j['durasi_per_pasien'],
                ]
            );
        }

        return redirect()->back();
    }
}
