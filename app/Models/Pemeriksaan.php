<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeriksaan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function antrian() { return $this->belongsTo(Antrian::class); }
    public function resepObat() { return $this->hasMany(ResepObat::class); }
}
