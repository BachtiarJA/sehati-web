<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_dokters', function (Blueprint $table) {
            $table->id();
            // Asumsi nama tabel dokter Anda adalah 'dokters' atau 'dokter' (sesuaikan jika beda)
            $table->foreignId('dokter_id')->constrained('dokter')->onDelete('cascade');
            $table->string('hari'); // Senin, Selasa, dst
            $table->time('jam_mulai')->nullable();
            $table->time('jam_selesai')->nullable();
            $table->integer('durasi_per_pasien')->default(15);
            $table->boolean('is_aktif')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_dokters');
    }
};
