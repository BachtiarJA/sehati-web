<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resep_obats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pasien_id')->constrained('pasiens')->cascadeOnDelete();
            $table->foreignId('pemeriksaan_id')->nullable()->constrained('pemeriksaans')->cascadeOnDelete();

            // --- INI YANG BERUBAH ---
            // Hapus $table->string('nama_obat');
            // Ganti dengan relasi ke tabel obats
            $table->foreignId('obat_id')->constrained('obats')->cascadeOnDelete();

            $table->string('dosis');
            $table->integer('jumlah');
            $table->string('berapa_kali');
            $table->longText('waktu');
            $table->integer('berapa_hari');
            $table->enum('status_alarm', ['aktif', 'selesai', 'dibatalkan'])->default('aktif');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resep_obat');
    }
};
