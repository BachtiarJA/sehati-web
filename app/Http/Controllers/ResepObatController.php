<?php

namespace App\Http\Controllers;

use App\Models\ResepObat;
use App\Models\Pasien;
use App\Models\Obat;
use App\Models\Pemeriksaan; // <-- Tambahan Model
use App\Models\JadwalMinumObat; // <-- Tambahan Model
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
            'pasiens' => $pasiens,
            'obats' => $obats
        ]);
    }

    // 3. Fungsi untuk menyimpan resep baru dari pop-up
    public function store(Request $request)
    {
        // 1. Validasi awal
        $request->validate([
            'pasien_id' => 'required|exists:pasiens,id',
            'obat_list' => 'required|array|min:1',
        ]);

        // [BARU] Cari ID Pemeriksaan terakhir untuk pasien ini pada HARI INI
        $pemeriksaan = Pemeriksaan::whereHas('antrian', function ($query) use ($request) {
            $query->where('pasien_id', $request->pasien_id)
                  ->whereDate('tgl_kunjungan', Carbon::today());
        })->latest()->first();

        // 2. Looping data obat dari list frontend dan simpan satu per satu
        foreach ($request->obat_list as $obat) {
            $waktuArray = array_map('trim', explode(',', $obat['waktu']));

            ResepObat::create([
                'pasien_id' => $request->pasien_id,
                'pemeriksaan_id' => $pemeriksaan ? $pemeriksaan->id : null, // <-- [BARU] Isi pemeriksaan_id
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

        // 3. [BARU] GENERATE JADWAL TRACKING SETELAH RESEP TERSIMPAN
        if ($pemeriksaan) {
            $this->generateJadwalOtomatis($pemeriksaan->id);
        }

        return redirect()->back();
    }

    /**
     * [BARU] FUNGSI PRIVATE UNTUK MENG-GENERATE JADWAL MINUM OBAT
     * (Menggabungkan jam yang sama / Time-Slot Grouping)
     */
    private function generateJadwalOtomatis($pemeriksaan_id)
    {
        // 1. Ambil semua resep obat dari pemeriksaan ini
        $resepObats = ResepObat::where('pemeriksaan_id', $pemeriksaan_id)->get();

        $kumpulanJadwal = [];

        // 2. Looping per resep obat untuk memecah tanggal & jam
        foreach ($resepObats as $resep) {
            $jumlahHari = $resep->berapa_hari;
            $jamMinumArray = json_decode($resep->waktu, true);

            if (!is_array($jamMinumArray)) continue;

            // Ulangi untuk setiap hari (mulai hari ini)
            for ($i = 0; $i < $jumlahHari; $i++) {
                $tanggal = Carbon::today()->addDays($i)->format('Y-m-d');

                // Ulangi untuk setiap jam (misal: "08:00")
                foreach ($jamMinumArray as $jam) {
                    // Buat format: "2026-05-10 08:00:00"
                    $datetime = $tanggal . ' ' . $jam . ':00';

                    // Kita gunakan format Waktu sebagai "Key" Array.
                    // Jika ada jam 08:00 dari Paracetamol dan jam 08:00 dari Vitamin C,
                    // array ini akan otomatis menimpanya menjadi HANYA 1 jadwal (Grouping).
                    $kumpulanJadwal[$datetime] = [
                        'pemeriksaan_id' => $pemeriksaan_id,
                        'waktu_jadwal' => $datetime,
                        'status' => 'belum',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // 3. Hapus jadwal lama untuk pemeriksaan ini (Berguna jika dokter merevisi/mengedit resep)
        JadwalMinumObat::where('pemeriksaan_id', $pemeriksaan_id)->delete();

        // 4. Insert data yang sudah di-grouping ke database sekaligus (Bulk Insert)
        if (!empty($kumpulanJadwal)) {
            JadwalMinumObat::insert(array_values($kumpulanJadwal));
        }
    }
}
