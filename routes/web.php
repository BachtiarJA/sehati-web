<?php

use App\Http\Controllers\AntrianController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JadwalDokterController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\KelolaDokterController;
use App\Http\Controllers\Admin\PendaftaranController;
use App\Http\Controllers\RekamMedisController;
use App\Http\Controllers\ResepObatController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Dokter (Tambah, Edit, Hapus)
    Route::get('/dokter', [KelolaDokterController::class, 'index'])->name('dokter.index');
    Route::post('/dokter', [KelolaDokterController::class, 'store'])->name('dokter.store');
    Route::put('/dokter/{id}', [KelolaDokterController::class, 'update'])->name('dokter.update');
    Route::delete('/dokter/{id}', [KelolaDokterController::class, 'destroy'])->name('dokter.destroy');
    // Pendaftaran Pasien Langsung & Antrian
    Route::get('/pendaftaran', [PendaftaranController::class, 'index'])->name('pendaftaran.index');
    Route::post('/pendaftaran/akun-baru', [PendaftaranController::class, 'buatAkunPasien'])->name('pendaftaran.akun_baru');

    Route::post('/pendaftaran/antrian', [PendaftaranController::class, 'tambahAntrian'])->name('pendaftaran.antrian');
    Route::get('/daftar-obat', [ObatController::class, 'index'])->name('daftar-obat.index');
    Route::post('/daftar-obat', [ObatController::class, 'store'])->name('daftar-obat.store');
    Route::delete('/daftar-obat/{id}', [ObatController::class, 'destroy'])->name('daftar-obat.destroy');

});
Route::middleware(['auth', 'role:dokter'])->group(function () {


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/antrian', [AntrianController::class, 'index'])->name('antrian');

    Route::patch('/antrian/{id}/periksa', [AntrianController::class, 'periksa'])->name('antrian.periksa');
    Route::get('/rekam-medis', [RekamMedisController::class, 'index'])->name('rekam-medis');
    Route::get('/rekam-medis/{id}/export-word', [App\Http\Controllers\RekamMedisController::class, 'exportWord'])->name('rekam-medis.export');
    Route::get('/diagnosis', [PemeriksaanController::class, 'index'])->name('diagnosis');
    Route::post('/diagnosis', [PemeriksaanController::class, 'store'])->name('diagnosis.store');
    Route::put('/diagnosis/{id}', [PemeriksaanController::class, 'update'])->name('diagnosis.update');
    Route::get('/surat-sakit/{id}', [PemeriksaanController::class, 'exportWord'])->name('surat-sakit.export');
    Route::delete('/diagnosis/{id}', [PemeriksaanController::class, 'destroy'])->name('diagnosis.destroy');

    Route::get('/jadwal-praktek', [JadwalDokterController::class, 'index'])->name('jadwal.index');
    Route::post('/jadwal-praktek', [JadwalDokterController::class, 'store'])->name('jadwal.store');

    Route::get('/resep-obat', [ResepObatController::class, 'index'])->name('resep-obat.index');
    Route::post('/resep-obat', [ResepObatController::class, 'store'])->name('resep-obat.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
