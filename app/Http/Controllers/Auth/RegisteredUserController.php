<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Dokter; // <-- Pastikan Model Dokter di-import
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // <-- Import DB Transaction
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi Inputan
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Validasi tambahan untuk tabel dokter
            'keahlian' => 'required|in:Umum,Khitan',
            'no_str' => 'required|string|max:255|unique:dokter,no_str', // Pastikan no_str tidak kembar di tabel dokter
            'no_telp' => 'required|string|max:20',
        ]);

        // 2. Gunakan DB Transaction agar aman
        $user = DB::transaction(function () use ($request) {

            // A. Buat Akun User (dengan role 'dokter')
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'dokter', // Set role secara otomatis
            ]);

            // B. Buat Profil Dokter
            Dokter::create([
                'user_id' => $newUser->id, // Mengambil ID dari akun yang baru dibuat
                'nama_dokter' => $request->name, // Kita gunakan nama akun sebagai nama dokter
                'keahlian' => $request->keahlian,
                'no_str' => $request->no_str,
                'no_telp' => $request->no_telp,
            ]);

            return $newUser;
        });

        event(new Registered($user));

        Auth::login($user);

        // Arahkan ke dashboard dokter (sesuai route yang kita buat di Middleware sebelumnya)
        return redirect(route('dashboard', absolute: false));
    }
}
