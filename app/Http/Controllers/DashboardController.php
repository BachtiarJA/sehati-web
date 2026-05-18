<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $dokter = Auth::user()->dokter;
        $hariIni = Carbon::today();

        // 1. STATISTIK KARTU ATAS
        $totalKunjungan = Antrian::where('dokter_id', $dokter->id)->whereDate('tgl_kunjungan', $hariIni)->count();
        $antrianAktif = Antrian::where('dokter_id', $dokter->id)->whereDate('tgl_kunjungan', $hariIni)->where('status', 'menunggu')->count();

        // 2. DATA GRAFIK MINGGUAN (7 Hari Terakhir)
        $grafikMingguan = [];
        for ($i = 6; $i >= 0; $i--) {
            $tanggal = Carbon::today()->subDays($i);
            // Pasien Langsung (Di database saat ini)
            $pasien = Antrian::where('dokter_id', $dokter->id)->whereDate('tgl_kunjungan', $tanggal)->count();

            $grafikMingguan[] = [
                'name' => $tanggal->locale('id')->translatedFormat('D'), // Sen, Sel, dll
                'pasien' => $pasien,
                'online' => 0, // Dikosongkan sementara karena fitur booking online belum ada
            ];
        }

        // 3. DATA GRAFIK BULANAN (Simulasi 4 Minggu)
        $grafikBulanan = [
            ['name' => 'Minggu 1', 'pasien' => rand(30, 80), 'online' => 0],
            ['name' => 'Minggu 2', 'pasien' => rand(30, 80), 'online' => 0],
            ['name' => 'Minggu 3', 'pasien' => rand(30, 80), 'online' => 0],
            ['name' => 'Minggu 4', 'pasien' => $totalKunjungan, 'online' => 0],
        ];

        // 4. AKTIVITAS TERBARU (Ambil 4 antrian terakhir hari ini)
        $antrianTerbaru = Antrian::where('dokter_id', $dokter->id)
            ->whereDate('tgl_kunjungan', $hariIni)
            ->orderBy('updated_at', 'desc')
            ->take(4)
            ->get()
            ->map(function($item) {
                // Sesuaikan icon/warna berdasarkan status di database
                if ($item->status == 'selesai') {
                    return ['type' => 'selesai', 'title' => 'Pemeriksaan Selesai', 'desc' => 'Pasien ' . $item->pasien->nama . ' selesai diperiksa.', 'time' => $item->updated_at->diffForHumans(null, true, true)];
                } else if ($item->status == 'diperiksa') {
                    return ['type' => 'diperiksa', 'title' => 'Sedang Diperiksa', 'desc' => 'Pasien ' . $item->pasien->nama . ' di ruang poli.', 'time' => $item->updated_at->diffForHumans(null, true, true)];
                } else {
                    return ['type' => 'baru', 'title' => 'Antrian Baru', 'desc' => 'Pasien ' . $item->pasien->nama . ' menunggu.', 'time' => $item->created_at->diffForHumans(null, true, true)];
                }
            });

        // Kirim semua data ke React (Inertia)
        return Inertia::render('dashboard', [
            'dokter_name' => $dokter->nama_dokter,
            'stats' => [
                'total_kunjungan' => $totalKunjungan,
                'antrian_aktif' => $antrianAktif,
            ],
            'chart_data' => [
                'mingguan' => $grafikMingguan,
                'bulanan' => $grafikBulanan,
            ],
            'activities' => $antrianTerbaru
        ]);
    }
}
