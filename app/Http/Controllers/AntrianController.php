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
        $hariIni = Carbon::today();

        // 2. Ambil data antrian hari ini untuk dokter tersebut
        $antrians = Antrian::with('pasien')
            ->where('dokter_id', $dokter->id)
            ->whereDate('tgl_kunjungan', $hariIni)
            ->orderBy('no_antrian', 'asc')
            ->get()
            ->map(function ($antrian) {
                return [
                    'id' => $antrian->id,
                    'no' => 'A' . str_pad($antrian->no_antrian, 3, '0', STR_PAD_LEFT), // Hasil: A001, A002
                    'name' => $antrian->pasien->nama,
                    'status' => $antrian->status,
                    'time' => $antrian->created_at->format('H:i'), // Hasil: 08:30
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
        // Nanti bisa diubah jadi route('diagnosis', $id) kalau halaman diagnosisnya sudah siap menerima ID
        return redirect()->route('diagnosis');
    }
}

