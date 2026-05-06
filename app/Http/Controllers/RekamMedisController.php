<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekamMedisController extends Controller
{
    public function index()
    {
        // Ambil semua data pasien beserta riwayat antrian dan pemeriksaannya
        $pasiens = Pasien::with(['antrians.pemeriksaan', 'antrians.dokter'])
            ->get()
            ->map(function ($pasien) {

                // 1. Filter antrian yang sudah ada pemeriksaannya
                // 2. Urutkan berdasarkan tanggal dibuatnya PEMERIKSAAN dari yang paling baru
                $riwayat = $pasien->antrians
                    ->whereNotNull('pemeriksaan')
                    ->sortByDesc(function ($antrian) {
                    return $antrian->pemeriksaan->created_at;
                })
                    ->map(function ($antrian) {
                    return [
                        'id_pemeriksaan' => $antrian->pemeriksaan->id,
                        'tanggal' => $antrian->pemeriksaan->created_at->format('d M Y'),
                        'keluhan' => $antrian->pemeriksaan->keluhan,
                        'diagnosa' => $antrian->pemeriksaan->diagnosa,
                        'tindakan' => $antrian->pemeriksaan->tindakan,
                        'tb' => $antrian->pemeriksaan->tinggi_badan,
                        'bb' => $antrian->pemeriksaan->berat_badan,

                        // NAMA DOKTER HARUSNYA DI SINI (Di dalam map riwayat)
                        'nama_dokter' => $antrian->dokter->nama_dokter ?? 'Tidak Diketahui'
                    ];
                })->values();

                // KEMBALIKAN DATA PASIEN (Pastikan 'nama' ada di sini!)
                return [
                    'id' => $pasien->id,
                    'nama' => $pasien->nama, // <--- KEMBALIKAN BARIS INI YANG SEMPAT TERHAPUS
                    'no_rm' => 'RM-' . str_pad($pasien->id, 4, '0', STR_PAD_LEFT),
                    'total_kunjungan' => $riwayat->count(),
                    'terakhir_periksa' => $riwayat->first()['tanggal'] ?? 'Belum ada riwayat',
                    'riwayat' => $riwayat
                ];
            });

        return Inertia::render('rekam-medis', [
            'pasiens' => $pasiens
        ]);
    }
}
