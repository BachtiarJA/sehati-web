<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register as dokter', function () {
    // Menyediakan data lengkap sesuai validasi di RegisteredUserController
    $response = $this->post('/register', [
        'name' => 'Dr. Bachtiar',
        'email' => 'bachtiar@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'keahlian' => 'Umum', // Harus 'Umum' atau 'Khitan'
        'no_str' => 'STR-1234567890',
        'no_telp' => '081234567890',
    ]);

    // Memastikan user berhasil login setelah register
    $this->assertAuthenticated();

    // Memastikan sistem mengarahkan user ke halaman dashboard
    $response->assertRedirect(route('dashboard', absolute: false));
});
