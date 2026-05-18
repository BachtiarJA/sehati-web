<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_minum_obats', function (Blueprint $table) {
            $table->id();
            // Menyambung ke tabel pemeriksaans
            $table->foreignId('pemeriksaan_id')->constrained('pemeriksaans')->onDelete('cascade');

            // Waktu jadwal (Kapan harus diminum)
            $table->dateTime('waktu_jadwal');

            // Waktu aktual (Kapan pasien klik tombol di HP)
            $table->dateTime('waktu_aktual')->nullable();

            // Status obat
            $table->enum('status', ['belum', 'sudah', 'terlewat'])->default('belum');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_minum_obats');
    }
};
