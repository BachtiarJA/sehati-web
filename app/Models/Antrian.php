<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Antrian extends Model
{
    use HasFactory;

    // Mengizinkan semua kolom diisi
    protected $guarded = ['id'];

    public function pasien() { return $this->belongsTo(Pasien::class); }
    public function dokter() { return $this->belongsTo(Dokter::class); }
    public function pemeriksaan() { return $this->hasOne(Pemeriksaan::class); }
}
