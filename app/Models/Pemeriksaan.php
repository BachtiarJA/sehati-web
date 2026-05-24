<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeriksaan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function antrian()
    {
        return $this->belongsTo(Antrian::class);
    }

    public function resepObats()
    {
        // 🟢 PERBAIKAN: Tambahkan 'id_pemeriksaan' agar sinkron dengan file ResepObat.php
        return $this->hasMany(ResepObat::class, 'pemeriksaan_id');
    }

    public function jadwalMinumObats()
    {
        // 1 Pemeriksaan memiliki banyak Jadwal Minum Obat
        return $this->hasMany(JadwalMinumObat::class, 'pemeriksaan_id');
    }
}