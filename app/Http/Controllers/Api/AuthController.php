<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pasien; // 💡 IMPORT: Pastikan model Pasien di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // 💡 IMPORT: Untuk mengamankan query ganda

class AuthController extends Controller
{
    /**
     * FUNGSI REGISTER PASIEN BARU VIA MOBILE
     */
    public function register(Request $request)
    {
        // 1. Validasi input pendaftaran
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pendaftaran gagal, validasi tidak terpenuhi',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Gunakan Transaction agar jika salah satu tabel gagal dimasuki, database di-rollback
        DB::beginTransaction();

        try {
            // A. Buat data akun di tabel users
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'pasien', // 🔥 KUNCI: Wajib otomatis diset sebagai pasien agar bisa login mobile
            ]);

            // B. Buat data profil kosong pendukung di tabel pasien yang berelasi dengan user_id
            $pasien = Pasien::create([
                'user_id' => $user->id,
                // Kolom lain seperti nik, no_telepon, alamat dibiarkan kosong/nullable dulu 
                // untuk diisi nanti di halaman edit profil.
            ]);

            DB::commit(); // Kunci perubahan ke database jika keduanya sukses

            // 3. Otomatis buatkan Token Sanctum (Auto-Login setelah register)
            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Pendaftaran pasien baru berhasil!',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'pasien_id' => $pasien->id
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua pembuatan jika ada database yang crash
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem saat registrasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * FUNGSI LOGIN PASIEN
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau Password salah!'
            ], 401);
        }

        if ($user->role !== 'pasien') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Aplikasi ini hanya untuk pasien.'
            ], 403);
        }

        $token = $user->createToken('MobileAppToken')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'pasien_id' => $user->pasien->id ?? null
                ]
            ]
        ], 200);
    }

    /**
     * FUNGSI LOGOUT PASIEN
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ], 200);
    }
}