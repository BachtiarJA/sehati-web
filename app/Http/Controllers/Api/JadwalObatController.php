<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalMinumObat;
use App\Models\Antrian; // 💡 Pastikan model Antrian di-import
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalObatController extends Controller
{
    /**
     * Mengambil daftar jadwal minum obat pasien HARI INI
     */
    public function hariIni(Request $request)
    {
        $pasien = $request->user()->pasien;

        if (!$pasien) {
            return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
        }

        // Cari jadwal HARI INI milik pasien tersebut
        $jadwalHariIni = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
            ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                $query->where('pasien_id', $pasien->id);
            })
            ->whereDate('waktu_jadwal', Carbon::today())
            ->orderBy('waktu_jadwal', 'asc')
            ->get();

        // Format data agar mudah dibaca oleh Frontend Developer (Mobile App)
        $data = $jadwalHariIni->map(function ($jadwal) {
            $daftarObat = $jadwal->pemeriksaan->resepObats->map(function ($resep) {
                return $resep->obat->nama_obat . ' (' . $resep->dosis . ')';
            })->implode(', ');

            return [
                'id_jadwal' => $jadwal->id,
                'jam_minum' => $jadwal->waktu_jadwal->format('H:i'), 
                'daftar_obat' => $daftarObat, 
                'status' => $jadwal->status, 
                'waktu_diminum' => $jadwal->waktu_aktual ? $jadwal->waktu_aktual->format('H:i') : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal hari ini berhasil diambil',
            'data' => $data
        ], 200);
    }

    /**
     * Memproses ketika pasien menekan tombol "SAYA SUDAH MINUM"
     */
    public function tandaiSudahMinum(Request $request, $id_jadwal)
    {
        $pasien = $request->user()->pasien;

        $jadwal = JadwalMinumObat::whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                $query->where('pasien_id', $pasien->id);
            })->find($id_jadwal);

        if (!$jadwal) {
            return response()->json(['status' => 'error', 'message' => 'Jadwal tidak ditemukan atau akses ditolak.'], 404);
        }

        if ($jadwal->status === 'sudah') {
            return response()->json(['status' => 'error', 'message' => 'Obat ini sudah ditandai diminum sebelumnya.'], 400);
        }

        $jadwal->update([
            'status' => 'sudah',
            'waktu_aktual' => now() 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hebat! Anda telah meminum obat tepat waktu.',
            'waktu_diminum' => $jadwal->waktu_aktual->format('H:i')
        ], 200);
    }

    /**
     * Dashboard Beranda Mobile
     */
    public function dashboardMobile(Request $request)
    {
        try {
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            // 🔍 =================== START SUNTIKAN DEBUG DATA ===================
            $hariIniKlinik = Carbon::today('Asia/Jakarta')->toDateString();
            $antrianTerakhirDiDB = \DB::table('antrians')
                ->where('pasien_id', $pasien->id)
                ->orderBy('id', 'desc')
                ->first();

            return response()->json([
                'status' => 'success',
                'DIAGNOSIS_DEBUG_MEDVORA' => [
                    'waktu_sekarang_vps' => Carbon::now()->toString(),
                    'tanggal_hari_ini_target_laravel' => $hariIniKlinik,
                    'pasien_id_yang_sedang_login' => $pasien->id,
                    'data_booking_terakhir_di_tabel_db' => $antrianTerakhirDiDB ? [
                        'id' => $antrianTerakhirDiDB->id,
                        'pasien_id' => $antrianTerakhirDiDB->pasien_id,
                        'tgl_kunjungan_asli_db' => $antrianTerakhirDiDB->tgl_kunjungan,
                        'status_asli_db' => $antrianTerakhirDiDB->status,
                    ] : 'Tabel antrians kosong melongpong untuk pasien ini!'
                ]
            ], 200);

            return response()->json([
                'status' => 'success', 
                'data' => [
                    'tanggal_hari_ini' => Carbon::now('Asia/Jakarta')->locale('id')->translatedFormat('l, d M Y'), 
                    'pasien' => ['nama' => $pasien->nama ?? $user->name], 
                    'ringkasan' => [
                        'total_jadwal_kunjungan' => count($visitsPayload) . ' Jadwal', 
                        'total_jadwal_obat' => count($medicinesPayload) . ' Jadwal'
                    ], 
                    'visits' => $visitsPayload, 
                    'medicines' => $medicinesPayload
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses beranda: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 💾 FIXED: Mengambil data Riwayat Kunjungan dan Obat menggunakan FULL ELOQUENT ORM (Anti Error 500)
     */
    public function riwayatMobile(Request $request)
    {
        try {
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            $hariIni = Carbon::today()->toDateString();
            $waktuSekarang = Carbon::now();

            // 💡 Deteksi nama tabel Antrian asli secara dinamis dari Model (mengantisipasi singular/plural)
            $antrianTable = (new Antrian)->getTable();

            // =========================================================================
            // 1. QUERY RIWAYAT KUNJUNGAN (Menggunakan Model Antrian + Join Dokter)
            // =========================================================================
            $kunjunganMasaLalu = Antrian::join('dokter', "{$antrianTable}.dokter_id", '=', 'dokter.id')
                ->where("{$antrianTable}.pasien_id", $pasien->id)
                ->where(function ($query) use ($hariIni, $antrianTable) {
                    $query->whereDate("{$antrianTable}.tgl_kunjungan", '<', $hariIni)
                          ->orWhereIn("{$antrianTable}.status", ['selesai', 'batal']);
                })
                ->orderBy("{$antrianTable}.tgl_kunjungan", 'desc')
                ->select(
                    "{$antrianTable}.id",
                    "{$antrianTable}.tgl_kunjungan",
                    "{$antrianTable}.jam_kunjungan",
                    "{$antrianTable}.no_antrian",
                    "{$antrianTable}.status",
                    'dokter.nama_dokter',
                    'dokter.keahlian'
                )
                ->get();

            $riwayatKunjungan = $kunjunganMasaLalu->map(function ($antrean) {
                return [
                    'id_booking' => $antrean->id,
                    'nomor_booking' => 'BK-' . Carbon::parse($antrean->tgl_kunjungan)->format('dmy') . '-' . str_pad($antrean->no_antrian, 3, '0', STR_PAD_LEFT),
                    'tanggal' => Carbon::parse($antrean->tgl_kunjungan)->translatedFormat('d M Y'),
                    'jam' => Carbon::parse($antrean->jam_kunjungan)->format('H:i') . ' WIB',
                    'dokter' => $antrean->nama_dokter,
                    'poli' => $antrean->keahlian,
                    'status' => ucfirst($antrean->status)
                ];
            });

            // =========================================================================
            // 2. QUERY RIWAYAT OBAT (Full Jalur Aman Mengikuti Fungsi hariIni)
            // =========================================================================
            $obatMasaLalu = JadwalMinumObat::with('pemeriksaan.resepObats.obtain')
                ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                    $query->where('pasien_id', $pasien->id);
                })
                ->where('waktu_jadwal', '<', $waktuSekarang)
                ->orderBy('waktu_jadwal', 'desc')
                ->get();

            $riwayatObat = [];
            foreach ($obatMasaLalu as $jadwal) {
                $waktuJadwalFormated = Carbon::parse($jadwal->waktu_jadwal)->translatedFormat('d M Y, H:i') . ' WIB';
                $waktuDiminumFormated = $jadwal->waktu_aktual ? Carbon::parse($jadwal->waktu_aktual)->format('H:i') . ' WIB' : '-';
                
                // Sinkronisasi status string agar dibaca valid oleh UI riwayat mobile
                $statusLabel = 'Terlewat';
                if ($jadwal->status === 'sudah') $statusLabel = 'Diminum';
                if ($jadwal->status === 'belum') $statusLabel = 'Belum Verifikasi';

                if ($jadwal->pemeriksaan && $jadwal->pemeriksaan->resepObats) {
                    foreach ($jadwal->pemeriksaan->resepObats as $resep) {
                        $riwayatObat[] = [
                            'id_jadwal' => $jadwal->id,
                            'nama_obat' => $resep->obat->nama_obat ?? 'Nama Obat',
                            'dosis' => $resep->dosis ?? '-',
                            'waktu_jadwal' => $waktuJadwalFormated,
                            'waktu_diminum' => $waktuDiminumFormated,
                            'status' => $statusLabel,
                            'description' => $jadwal->status === 'sudah' ? 'Verifikasi minum obat berhasil' : 'Belum melakukan verifikasi minum obat'
                        ];
                    }
                }
            }

            // =========================================================================
            // 3. ENCAPSULATE JSON RESPONS
            // =========================================================================
            return response()->json([
                'status' => 'success',
                'message' => 'Seluruh data riwayat berhasil diambil secara riil',
                'data' => [
                    'riwayat_kunjungan' => $riwayatKunjungan,
                    'riwayat_obat' => $riwayatObat
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses riwayat: ' . $e->getMessage()], 500);
        }
    }
}