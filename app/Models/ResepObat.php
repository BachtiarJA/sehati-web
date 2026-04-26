<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResepObat extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Beritahu Laravel bahwa 'waktu' adalah Array/JSON
    protected $casts = [
        'waktu' => 'array',
    ];

    public function pemeriksaan() { return $this->belongsTo(Pemeriksaan::class); }
}
