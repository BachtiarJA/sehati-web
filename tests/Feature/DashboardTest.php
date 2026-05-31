<?php

use App\Models\User;
use App\Models\Dokter; // Jangan lupa import Model Dokter

test('guests are redirected to the login page', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

test('authenticated dokter can visit the dashboard', function () {
    // 1. Buat user simulasi dengan role dokter
    $user = User::factory()->create([
        'role' => 'dokter',
    ]);

    // 2. Buat profil dokter yang berelasi dengan user simulasi tersebut
    Dokter::create([
        'user_id' => $user->id,
        'nama_dokter' => $user->name,
        'keahlian' => 'Umum',
        'no_str' => 'STR-TEST-123',
        'no_telp' => '08123456789',
    ]);

    // 3. Simulasikan login, lalu akses dashboard
    $response = $this->actingAs($user)->get('/dashboard');

    // 4. Pastikan halamannya berhasil dibuka (Status 200)
    $response->assertOk();
});
