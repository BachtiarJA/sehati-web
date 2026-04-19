<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'role:dokter'])->group(function () {


    Route::get('/dashboard', function () {

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/antrian', function () {
        return Inertia::render('antrian');
    })->name('antrian');


    Route::get('/diagnosis', function () {
        return Inertia::render('diagnosis');
    })->name('diagnosis');


    Route::get('/resep-obat', function () {
        return Inertia::render('obat');
    })->name('obat');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
