<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    public function index()
    {
        $obats = Obat::orderBy('nama_obat', 'asc')->get();

        // --- LOGIKA MENCARI KODE BERIKUTNYA UNTUK DITAMPILKAN ---
        $obatTerakhir = Obat::orderBy('id', 'desc')->first();
        if (!$obatTerakhir || !$obatTerakhir->kode_obat) {
            $nextKode = 'OBT-001';
        } else {
            $angkaTerakhir = (int) substr($obatTerakhir->kode_obat, 4);
            $nextKode = 'OBT-' . str_pad($angkaTerakhir + 1, 3, '0', STR_PAD_LEFT);
        }

        return inertia('admin/daftar-obat', [
            'obats' => $obats,
            'nextKode' => $nextKode // <--- Kirim ke frontend
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input (kode_obat dihapus dari validasi karena dibuat otomatis)
        $request->validate([
            'nama_obat' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'jenis' => 'required|in:tablet,kapsul,sirup,salep,injeksi,botol',
        ], [
            'nama_obat.required' => 'Nama obat wajib diisi.',
        ]);

        // 2. Logika Pembuatan Kode Obat Otomatis (OBT-001, OBT-002, dst)
        $obatTerakhir = Obat::orderBy('id', 'desc')->first();

        if (!$obatTerakhir || !$obatTerakhir->kode_obat) {
            // Jika belum ada obat sama sekali
            $kodeBaru = 'OBT-001';
        } else {
            // Ambil angka dari kode terakhir (Misal: OBT-005 -> ambil 005)
            $angkaTerakhir = (int) substr($obatTerakhir->kode_obat, 4);
            $angkaBaru = $angkaTerakhir + 1;

            // Format kembali menjadi 3 digit angka (str_pad)
            $kodeBaru = 'OBT-' . str_pad($angkaBaru, 3, '0', STR_PAD_LEFT);
        }

        // 3. Simpan ke Database
        Obat::create([
            'kode_obat' => $kodeBaru, // Masukkan kode otomatis di sini
            'nama_obat' => $request->nama_obat,
            'kategori' => $request->kategori,
            'jenis' => $request->jenis,
        ]);

        return redirect()->back();
    }
    public function destroy($id)
    {
        $obat = Obat::findOrFail($id);
        $obat->delete();

        // Kembali ke halaman sebelumnya (tabel otomatis ter-update)
        return redirect()->back();
    }
}
