<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dokter', function (Blueprint $table) {
        $table->id(); // Ini adalah id_dokter

        // Jembatan ke tabel users (akun)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

        // Atribut sesuai ERD Anda
        $table->string('nama_dokter');
        $table->string('keahlian');
        $table->string('no_str')->unique(); 
        $table->string('no_telp');

        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokter');
    }
};
