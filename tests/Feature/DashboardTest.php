<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

test('authenticated dokter can visit the dashboard', function () {
    // Buat user simulasi dan langsung set role-nya menjadi 'dokter'
    $user = User::factory()->create([
        'role' => 'dokter',
    ]);

    // Simulasikan login sebagai user tersebut, lalu akses dashboard
    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();
});
