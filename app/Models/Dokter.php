<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Import untuk relasi

class Dokter extends Model
{
    use HasFactory;

    // Pastikan Laravel membaca tabel yang benar (karena nama tabel Anda 'dokter', bukan 'dokters')
    protected $table = 'dokter';

    // Izinkan kolom-kolom ini diisi secara massal saat registrasi
    protected $fillable = [
        'user_id',
        'nama_dokter',
        'keahlian',
        'no_str',
        'no_telp',
    ];

    // Jembatan balik ke tabel Users (Satu dokter milik satu akun user)
    public function akun(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
