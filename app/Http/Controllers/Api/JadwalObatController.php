<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalMinumObat;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalObatController extends Controller
{
    /**
     * Mengambil daftar jadwal minum obat pasien HARI INI (FIXED TIMEZONE)
     */
    public function hariIni(Request $request)
    {
        $pasien = $request->user()->pasien;

        if (!$pasien) {
            return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
        }

        // 💡 FIX 1: Kunci timezone Asia/Jakarta agar sinkron dengan kalender asli di HP pasien
        $hariIniKlinik = Carbon::today('Asia/Jakarta')->toDateString();

        // Cari jadwal HARI INI milik pasien tersebut
        $jadwalHariIni = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
            ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                $query->where('pasien_id', $pasien->id);
            })
            ->whereDate('waktu_jadwal', $hariIniKlinik)
            ->orderBy('waktu_jadwal', 'asc')
            ->get();

        // Format data agar mudah dibaca oleh Frontend Developer (Mobile App)
        $data = $jadwalHariIni->map(function ($jadwal) {
            $daftarObat = $jadwal->pemeriksaan->resepObats->map(function ($resep) {
                return $resep->obat->nama_obat . ' (' . $resep->dosis . ')';
            })->implode(', ');

            return [
                'id_jadwal' => $jadwal->id,
                'jam_minum' => Carbon::parse($jadwal->waktu_jadwal)->format('H:i'), 
                'daftar_obat' => $daftarObat, 
                'status' => $jadwal->status, 
                'waktu_diminum' => $jadwal->waktu_aktual ? Carbon::parse($jadwal->waktu_aktual)->format('H:i') : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal hari ini berhasil diambil',
            'data' => $data
        ], 200);
    }

    /**
     * Memproses ketika pasien menekan tombol "SAYA SUDAH MINUM" secara manual (FIXED TIMEZONE)
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

        // 💡 FIX 2: Samakan format pencatatan waktu dengan verifikasiObat MediaPipe (Asia/Jakarta)
        $jadwal->update([
            'status' => 'sudah',
            'waktu_aktual' => Carbon::now('Asia/Jakarta')->toDateTimeString() 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hebat! Anda telah meminum obat tepat waktu.',
            'waktu_diminum' => Carbon::parse($jadwal->waktu_aktual)->format('H:i')
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

            $hariIniKlinik = Carbon::today('Asia/Jakarta')->toDateString();

            // 1. Ambil data kunjungan hari ini
            $antrianTable = (new Antrian)->getTable();
            $antrianHariIni = Antrian::join('dokter', "{$antrianTable}.dokter_id", '=', 'dokter.id')
                ->where("{$antrianTable}.pasien_id", $pasien->id)
                ->whereDate("{$antrianTable}.tgl_kunjungan", $hariIniKlinik)
                ->orderBy("{$antrianTable}.jam_kunjungan", 'asc')
                ->select("{$antrianTable}.*", 'dokter.nama_dokter', 'dokter.keahlian')
                ->get();

            $visitsPayload = $antrianHariIni->map(function ($visit) { 
                return [
                    'date_label' => 'Hari ini', 
                    'poli' => $visit->keahlian, 
                    'doctor' => $visit->nama_dokter, 
                    'time' => Carbon::parse($visit->jam_kunjungan)->format('H:i'), 
                    'queue_number' => 'No. ' . $visit->no_antrian, 
                    'status' => 'Status: ' . ucfirst($visit->status), 
                    'is_today' => true
                ]; 
            })->toArray();

            // 2. Ambil data jadwal lewat JEMBATAN RELASI Eloquent
            $jadwalObatHariIni = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
                ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) { 
                    $query->where('pasien_id', $pasien->id); 
                })
                ->whereDate('waktu_jadwal', $hariIniKlinik)
                ->orderBy('waktu_jadwal', 'asc')
                ->get();

            // 3. Proses Merakit Grouping Array sesuai Konsep Lann
            $medicinesPayload = $jadwalObatHariIni->map(function ($jadwal) {
                $timeLabel = Carbon::parse($jadwal->waktu_jadwal)->format('H:i');
                $statusLabel = $jadwal->status === 'sudah' ? 'Sudah diminum' : ($jadwal->status === 'terlewat' ? 'Terlewat' : 'Belum diverifikasi');
                
                // Mengambil list resep obat yang bernaung di bawah id_pemeriksaan yang sama
                $daftarObat = $jadwal->pemeriksaan->resepObats->map(function ($resep) {
                    return [
                        'nama_obat' => $resep->obat->nama_obat ?? 'Nama Obat', 
                        'instruction' => $resep->keterangan ?? 'Diminum sesuai aturan dokter', 
                        'type' => $resep->obat->jenis ?? 'tablet', 
                        'dose' => $resep->dosis ?? '1 tablet', 
                        'description' => $resep->obat->kategori ?? 'Obat resep Klinik Sehati.'
                    ];
                })->toArray();

                return [
                    'id' => $jadwal->id, // ID tunggal jadwal pengunci grup (Angka 29)
                    'time' => $timeLabel, 
                    'status' => $statusLabel, 
                    'daftar_obat' => $daftarObat // Sub-array isi obat banyak sekaligus
                ];
            })->toArray();

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
                    'medicines' => $medicinesPayload // JSON rapi siap dilalap Flutter
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses beranda: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mengambil data Riwayat Kunjungan dan Obat (FIXED RELATION & TIMEZONE)
     */
    public function riwayatMobile(Request $request)
    {
        try {
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            // 💡 FIX 3: Amankan zona waktu pencarian masa lalu agar selaras dengan jam lokal Indonesia
            $hariIni = Carbon::today('Asia/Jakarta')->toDateString();
            $waktuSekarang = Carbon::now('Asia/Jakarta');

            $antrianTable = (new Antrian)->getTable();

            // 1. QUERY RIWAYAT KUNJUNGAN
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

            // 2. QUERY RIWAYAT OBAT 
            $obatMasaLalu = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
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

    /**
     * Verifikasi Kepatuhan Minum Obat via MediaPipe Mobile
     */
    public function verifikasiObat(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_minum_obats,id',
        ]);

        try {
            $jadwal = JadwalMinumObat::findOrFail($request->jadwal_id);

            if ($jadwal->status === 'sudah') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Jadwal obat ini sudah berhasil diverifikasi sebelumnya.'
                ], 400);
            }

            $jadwal->update([
                'status' => 'sudah',
                'waktu_aktual' => Carbon::now('Asia/Jakarta')->toDateTimeString(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Verifikasi MediaPipe berhasil dicatat! Status kepatuhan obat terupdate.',
                'data' => [
                    'jadwal_id' => $jadwal->id,
                    'status_terbaru' => $jadwal->status,
                    'waktu_minum' => Carbon::parse($jadwal->waktu_aktual)->locale('id')->translatedFormat('H:i \W\I\B, d M Y'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan verifikasi obat ke server: ' . $e->getMessage()
            ], 500);
        }
    }
}