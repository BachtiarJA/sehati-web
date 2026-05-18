<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalMinumObat extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Format tanggal otomatis menjadi object Carbon (agar mudah dimanipulasi)
    protected $casts = [
        'waktu_jadwal' => 'datetime',
        'waktu_aktual' => 'datetime',
    ];

    public function pemeriksaan()
    {
        return $this->belongsTo(Pemeriksaan::class);
    }
}
