<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResepObat extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'id_obat');
    }

    public function pasien()
    {
        return $this->belongsTo(Pasien::class);
    }

    public function pemeriksaan() 
    {
        return $this->belongsTo(Pemeriksaan::class, 'id_pemeriksaan');
    }
}
