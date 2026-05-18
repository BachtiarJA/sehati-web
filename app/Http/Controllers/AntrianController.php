<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AntrianController extends Controller
{
    public function index()
    {
        // 1. Ambil data dokter yang sedang login
        $dokter = Auth::user()->dokter;

        // Cegah error jika yang login bukan dokter
        if (!$dokter) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        $hariIni = Carbon::today();

        // 2. Ambil data antrian hari ini untuk dokter tersebut
        $antrians = Antrian::with('pasien')
            ->where('dokter_id', $dokter->id)
            ->whereDate('tgl_kunjungan', $hariIni)
            ->orderBy('jam_kunjungan', 'asc') // <--- [UBAH] Urutkan berdasarkan Jam Kunjungan
            ->get()
            ->map(function ($antrian) {
                return [
                    'id' => $antrian->id,
                    // 'no' dihapus karena sudah tidak dipakai
                    'name' => $antrian->pasien->nama,
                    'status' => $antrian->status,
                    // [UBAH] Gunakan jam_kunjungan, bukan created_at
                    'time' => \Carbon\Carbon::parse($antrian->jam_kunjungan)->format('H:i'),
                ];
            });

        // 3. Hitung statistik untuk 4 kartu di atas tabel
        $stats = [
            'total' => $antrians->count(),
            'diperiksa' => $antrians->where('status', 'diperiksa')->count(),
            'menunggu' => $antrians->where('status', 'menunggu')->count(),
            'selesai' => $antrians->where('status', 'selesai')->count(),
        ];

        // 4. Kirim data ke React (Inertia)
        return Inertia::render('antrian', [
            'antrians' => $antrians,
            'stats' => $stats,
        ]);
    }

    public function periksa($id)
    {
        // 1. Cari data antrian berdasarkan ID
        $antrian = Antrian::findOrFail($id);

        // 2. Ubah statusnya menjadi 'diperiksa'
        $antrian->update([
            'status' => 'diperiksa'
        ]);

        // 3. Arahkan dokter ke halaman Diagnosis
        return redirect()->route('diagnosis');
    }
}
