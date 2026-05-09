<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dokter;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KelolaDokterController extends Controller
{
    public function index()
    {
        // Ambil data dari tabel dokter beserta data loginnya (tabel users)
        $doktersData = Dokter::with('user')->orderBy('nama_dokter', 'asc')->get();

        // Format datanya agar sesuai dengan yang diminta oleh React Frontend
        $dokters = $doktersData->map(function ($dokter) {
            return [
                'id' => $dokter->id,
                'user_id' => $dokter->user_id,
                'nama_dokter' => $dokter->nama_dokter,
                'keahlian' => $dokter->keahlian,
                'no_str' => $dokter->no_str,
                'no_telp' => $dokter->no_telp,
                // Ambil email dari relasi tabel user
                'email' => $dokter->user ? $dokter->user->email : null,
            ];
        });

        // Kirim ke React dengan nama variabel 'dokters' (bukan 'staffs' lagi)
        return Inertia::render('admin/daftar-dokter', [
            'dokters' => $dokters
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_dokter' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'keahlian' => 'required|in:Umum,Khitan',
            'no_str' => 'required|string|max:255',
            'no_telp' => 'required|string|max:255',
        ]);

        // Gunakan DB Transaction agar jika salah satu gagal, keduanya dibatalkan
        DB::transaction(function () use ($request) {
            // 1. Buat Akun Login di tabel users
            $user = User::create([
                'name' => $request->nama_dokter,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'dokter', // Tetapkan otomatis rolenya sebagai dokter
            ]);

            // 2. Buat Data Profil di tabel dokter menggunakan ID user yang baru dibuat
            Dokter::create([
                'user_id' => $user->id, // Mengambil ID dari akun yg dibuat di atas
                'nama_dokter' => $request->nama_dokter,
                'keahlian' => $request->keahlian,
                'no_str' => $request->no_str,
                'no_telp' => $request->no_telp,
            ]);
        });

        return redirect()->back();
    }
}
