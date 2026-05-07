<?php

namespace App\Http\Controllers;

use App\Models\ResepObat;
use App\Models\Pasien;
use App\Models\Obat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ResepObatController extends Controller
{
    public function index()
    {
        // 1. Ambil data resep untuk tabel
        $resepData = ResepObat::with(['pasien', 'obat'])->orderBy('created_at', 'desc')->get();

        $reseps = $resepData->map(function ($resep) {
            return [
                'id' => $resep->id,
                'tanggal' => Carbon::parse($resep->created_at)->format('d M Y'),
                'nama_pasien' => $resep->pasien ? $resep->pasien->nama : 'Pasien Dihapus',
                'nama_obat' => $resep->obat ? $resep->obat->nama_obat : 'Obat Dihapus',
                'dosis' => $resep->dosis,
                'jumlah' => $resep->jumlah,
                'berapa_kali' => $resep->berapa_kali,
                'waktu' => is_array($resep->waktu) ? json_encode($resep->waktu) : $resep->waktu,
                'berapa_hari' => $resep->berapa_hari,
                'status_alarm' => $resep->status_alarm,
                'keterangan' => $resep->keterangan ?? '-',
            ];
        });

        // 2. Ambil data untuk Dropdown di Modal Tambah Resep
        $pasiens = Pasien::whereIn('id', function ($query) {
            $query->select('pasien_id')
                ->from('antrians')
                ->where('status', 'selesai')
                ->whereDate('tgl_kunjungan', Carbon::today());
        })->orderBy('nama', 'asc')->get();
        $obats = Obat::orderBy('nama_obat', 'asc')->get();

        return Inertia::render('obat', [
            'reseps' => $reseps,
            'pasiens' => $pasiens, // Kirim ke frontend
            'obats' => $obats      // Kirim ke frontend
        ]);
    }

    // 3. Fungsi untuk menyimpan resep baru dari pop-up
    public function store(Request $request)
    {
        // 1. Validasi awal
        $request->validate([
            'pasien_id' => 'required|exists:pasiens,id',
            'obat_list' => 'required|array|min:1', // Memastikan ada minimal 1 obat di list
        ]);

        // 2. Looping data obat dari list frontend dan simpan satu per satu
        foreach ($request->obat_list as $obat) {
            // Ubah format string "08:00, 14:00" menjadi array JSON
            $waktuArray = array_map('trim', explode(',', $obat['waktu']));

            ResepObat::create([
                'pasien_id' => $request->pasien_id,
                'obat_id' => $obat['obat_id'],
                'dosis' => $obat['dosis'],
                'jumlah' => $obat['jumlah'],
                'berapa_kali' => $obat['berapa_kali'],
                'waktu' => json_encode($waktuArray),
                'berapa_hari' => $obat['berapa_hari'],
                'status_alarm' => 'aktif',
                'keterangan' => $obat['keterangan'] ?? null,
            ]);
        }

        return redirect()->back();
    }
}
