<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PemeriksaanController extends Controller
{
    public function index()
    {
        $dokter = Auth::user()->dokter;

        // 1. Ambil riwayat pemeriksaan pasien untuk tabel
        $pemeriksaans = Pemeriksaan::with('antrian.pasien')
            ->whereHas('antrian', function ($query) use ($dokter) {
                $query->where('dokter_id', $dokter->id);
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama_pasien' => $p->antrian->pasien->nama ?? 'Unknown',
                    'keluhan' => $p->keluhan,
                    'diagnosa' => $p->diagnosa,
                    'tindakan' => $p->tindakan,
                    'tanggal_raw' => $p->created_at->format('Y-m-d'), // Untuk logika filter (Contoh: 2026-04-26)
                    'tanggal_format' => $p->created_at->format('d M Y'), // Untuk ditampilkan (Contoh: 26 Apr 2026)
                ];
            });

        // 2. Ambil antrian yang statusnya HANYA 'diperiksa' untuk Dropdown
        $antrianAktif = Antrian::with('pasien')
            ->where('dokter_id', $dokter->id)
            ->where('status', 'diperiksa')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'nama' => $a->pasien->nama . ' (A' . str_pad($a->no_antrian, 3, '0', STR_PAD_LEFT) . ')'
                ];
            });

        // Kirim ke React
        return Inertia::render('diagnosis', [
            'pemeriksaans' => $pemeriksaans,
            'antrianAktif' => $antrianAktif
        ]);
    }

    // Fungsi Simpan Data Baru
    public function store(Request $request)
    {
        $request->validate([
            'antrian_id' => 'required',
            'keluhan' => 'required',
            'diagnosa' => 'required',
            'tindakan' => 'required',
        ]);

        Pemeriksaan::create($request->all());

        // Otomatis ubah status antrian pasien menjadi 'selesai'
        Antrian::where('id', $request->antrian_id)->update(['status' => 'selesai']);

        return redirect()->back();
    }

    // Fungsi Update Data
    public function update(Request $request, $id)
    {
        $request->validate([
            'keluhan' => 'required',
            'diagnosa' => 'required',
            'tindakan' => 'required',
        ]);

        $pemeriksaan = Pemeriksaan::findOrFail($id);
        $pemeriksaan->update($request->only(['keluhan', 'diagnosa', 'tindakan']));

        return redirect()->back();
    }

    // Fungsi Hapus Data
    public function destroy($id)
    {
        Pemeriksaan::destroy($id);
        return redirect()->back();
    }
}
