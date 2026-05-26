<?php

use App\Http\Controllers\Api\JadwalObatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\API\ProfileController;

// ===========================================
// RUTE PUBLIK (Tidak butuh Token)
// ===========================================
Route::post('/mobile/login', [AuthController::class, 'login']);

Route::post('/chatbot', [ChatbotController::class, 'chat']);

// ===========================================
// RUTE PRIVATE (HANYA BISA DIAKSES JIKA ADA BEARER TOKEN)
// ===========================================
Route::middleware('auth:sanctum')->group(function () {

    

    Route::post('/mobile/verifikasi-obat', [JadwalObatController::class, 'verifikasiObat']);

    Route::get('/mobile/riwayat', [JadwalObatController::class, 'riwayatMobile']);

    Route::get('/mobile/rekam-medis/{antrian_id}', [BookingController::class, 'detailRekamMedis']);

    //Get dokter
    Route::get('/mobile/doctors', [BookingController::class, 'listDokter']);

    //Dashboard Api
    Route::get('/mobile/dashboard', [JadwalObatController::class, 'dashboardMobile']);

    // Booking Antrian
    Route::post('/mobile/booking', [BookingController::class, 'store']);

    // Logout Mobile (Untuk menghapus token)
    Route::post('/mobile/logout', [AuthController::class, 'logout']);

    // Cek Data Profile User saat ini
    Route::get('/mobile/profile', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'pasien' => $request->user()->pasien
        ]);
    });

    Route::get('/mobile/jadwal-obat', [JadwalObatController::class, 'hariIni']);

    
    Route::post('/mobile/minum-obat/{id_jadwal}', [JadwalObatController::class, 'tandaiSudahMinum']);

    Route::get('/user-profile', [ProfileController::class, 'index']);

});
