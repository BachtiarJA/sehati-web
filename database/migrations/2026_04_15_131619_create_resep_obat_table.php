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
        Schema::create('resep_obats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pemeriksaan_id')->constrained('pemeriksaans')->onDelete('cascade');

            $table->string('nama_obat');
            $table->string('dosis');
            $table->string('aturan');
            $table->integer('berapa_kali');

            $table->json('waktu');

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
