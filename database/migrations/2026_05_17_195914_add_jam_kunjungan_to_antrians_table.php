<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('antrians', function (Blueprint $table) {
            // Menambahkan kolom jam_kunjungan setelah tgl_kunjungan
            $table->time('jam_kunjungan')->after('tgl_kunjungan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('antrians', function (Blueprint $table) {
            $table->dropColumn('jam_kunjungan');
        });
    }
};
