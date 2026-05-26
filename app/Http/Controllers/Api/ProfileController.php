<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Antrian; // ✅ Menggunakan model Antrian sebagai Kunjungan
use App\Models\JadwalMinumObat; // ✅ Menggunakan model JadwalMinumObat sebagai data Obat

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 1. Ambil data user login via Token
            $user = auth()->user(); 
            
            // Fallback Jalur Aman Demo (Menggunakan query param atau ID 1)
            if (!$user) {
                $userId = $request->query('user_id', 1); 
                $user = User::find($userId);
            }

            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan.'], 404);
            }

            // Ambil ID Pasien jika ada relasinya di model User kalian
            $pasienId = $user->pasien ? $user->pasien->id : null;

            // ==========================================
            // 2. HITUNG STATISTIK KUNJUNGAN (Model: Antrian)
            // ==========================================
            try {
                // Coba hitung berdasarkan user_id terlebih dahulu
                $kunjunganCount = Antrian::where('user_id', $user->id)->count();
            } catch (\Exception $e) {
                try {
                    // Jika kolom user_id tidak ada, switch otomatis ke pasien_id
                    $kunjunganCount = $pasienId ? Antrian::where('pasien_id', $pasienId)->count() : 0;
                } catch (\Exception $ex) {
                    $kunjunganCount = 0; // Perlindungan terakhir jika kedua kolom tidak ada
                }
            }

            // ==========================================
            // 3. HITUNG STATISTIK OBAT (Model: JadwalMinumObat)
            // ==========================================
            try {
                // Coba hitung berdasarkan user_id
                $obatCount = JadwalMinumObat::where('user_id', $user->id)->count();
            } catch (\Exception $e) {
                try {
                    // Jika kolom user_id tidak ada, switch otomatis ke pasien_id
                    $obatCount = $pasienId ? JadwalMinumObat::where('pasien_id', $pasienId)->count() : 0;
                } catch (\Exception $ex) {
                    $obatCount = 0;
                }
            }

            // ==========================================
            // 4. RETURN RESPONSE JSON KE FLUTTER
            // ==========================================
            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status ?? 'Pasien Aktif Klinik Sehati', 
                'kunjungan_count' => $kunjunganCount,
                'obat_count' => $obatCount
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}