<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kunjungan; 
use App\Models\Obat; 

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

            // 2. Query Hitung Statistik Riil (Hanya Kunjungan dan Obat)
            $kunjunganCount = Kunjungan::where('user_id', $user->id)->count();
            $obatCount = Obat::where('user_id', $user->id)->count(); 

            // 3. Return Response JSON
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