<?php

use App\Http\Controllers\AntrianController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\KelolaDokterController;
use App\Http\Controllers\Admin\PendaftaranController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Dokter (Tambah, Edit, Hapus)
    Route::resource('dokter', KelolaDokterController::class);

    // Pendaftaran Pasien Langsung & Antrian
    Route::get('/pendaftaran', [PendaftaranController::class, 'index'])->name('pendaftaran.index');
    Route::post('/pendaftaran/akun-baru', [PendaftaranController::class, 'buatAkunPasien'])->name('pendaftaran.akun_baru');
    Route::post('/pendaftaran/antrian', [PendaftaranController::class, 'tambahAntrian'])->name('pendaftaran.antrian');

});
Route::middleware(['auth', 'role:dokter'])->group(function () {


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/antrian', [AntrianController::class, 'index'])->name('antrian');

    Route::patch('/antrian/{id}/periksa', [AntrianController::class, 'periksa'])->name('antrian.periksa');

    Route::get('/diagnosis', [PemeriksaanController::class, 'index'])->name('diagnosis');
    Route::post('/diagnosis', [PemeriksaanController::class, 'store'])->name('diagnosis.store');
    Route::put('/diagnosis/{id}', [PemeriksaanController::class, 'update'])->name('diagnosis.update');
    Route::delete('/diagnosis/{id}', [PemeriksaanController::class, 'destroy'])->name('diagnosis.destroy');



    Route::get('/resep-obat', function () {
        return Inertia::render('obat');
    })->name('obat');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
