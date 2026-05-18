<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Pasien extends Model
{
    use HasFactory;

    // Sesuaikan dengan nama tabel di migration Anda
    protected $table = 'pasiens';

    protected $fillable = [
        'user_id',
        'nama',
        'jenis_kelamin',
        'umur',
        'alamat',
    ];

    public function akun(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function antrians()
    {
        return $this->hasMany(Antrian::class);
    }
}
