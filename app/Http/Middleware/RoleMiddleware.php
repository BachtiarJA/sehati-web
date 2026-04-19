<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Kita menggunakan parameter ...$roles agar satu rute bisa diakses lebih dari 1 role jika diperlukan.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Cek apakah user sudah login
        if (!Auth::check()) {
            return redirect('/login');
        }

        // 2. Cek apakah role user ada di dalam daftar role yang diizinkan di rute ini
        $user = Auth::user();
        if (!in_array($user->role, $roles)) {
            // Jika role tidak sesuai (misal pasien mencoba masuk ke halaman dokter)
            // Lempar error 403 Forbidden
            abort(403, 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        // Jika lolos kedua pengecekan di atas, izinkan masuk ke halaman
        return $next($request);
    }
}
