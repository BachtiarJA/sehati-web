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
        return $this->hasMany(ResepObat::class);
    }
    public function jadwalMinumObats()
    {
        // 1 Pemeriksaan memiliki banyak Jadwal Minum Obat
        return $this->hasMany(JadwalMinumObat::class)->orderBy('waktu_jadwal', 'asc');
    }
}
