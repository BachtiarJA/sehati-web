<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalMinumObat;
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
     * 🌐 DIUBAH JADI RIIL: Menyuplai komponen data Beranda Mobile dari Database Berdasarkan ERD
     */
    public function dashboardMobile(Request $request)
    {
        try {
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            // =========================================================================
            // 1. DATA KUNJUNGAN HARI INI (Tabel: antrians JOIN dokter)
            // =========================================================================
            $antrianHariIni = \DB::table('antrians')
                ->join('dokter', 'antrians.dokter_id', '=', 'dokter.id')
                ->where('antrians.pasien_id', $pasien->id)
                ->whereDate('antrians.tgl_kunjungan', Carbon::today())
                ->orderBy('antrians.jam_kunjungan', 'asc')
                ->select('antrians.*', 'dokter.nama_dokter', 'dokter.keahlian')
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

            // =========================================================================
            // 2. DATA JADWAL OBAT HARI INI (Menggunakan Eloquent JadwalMinumObat)
            // =========================================================================
            $jadwalObatHariIni = JadwalMinumObat::with('pemeriksaan.resepObats.obat')
                ->whereHas('pemeriksaan.antrian', function ($query) use ($pasien) {
                    $query->where('pasien_id', $pasien->id);
                })
                ->whereDate('waktu_jadwal', Carbon::today())
                ->orderBy('waktu_jadwal', 'asc')
                ->get();

            $medicinesPayload = [];
            foreach ($jadwalObatHariIni as $jadwal) {
                $timeLabel = Carbon::parse($jadwal->waktu_jadwal)->format('H:i');
                
                // Format status agar ramah dibaca komponen UI mobile kalian
                $statusLabel = 'Belum diverifikasi';
                if ($jadwal->status === 'sudah') $statusLabel = 'Sudah diminum';
                if ($jadwal->status === 'terlewat') $statusLabel = 'Terlewat';

                foreach ($jadwal->pemeriksaan->resepObats as $resep) {
                    $medicinesPayload[] = [
                        'time' => $timeLabel,
                        'medicine_name' => $resep->obat->nama_obat ?? 'Nama Obat',
                        'instruction' => $resep->keterangan ?? 'Diminum sesuai aturan dokter',
                        'status' => $statusLabel,
                        'type' => $resep->obat->jenis ?? 'tablet',
                        'dose' => $resep->dosis ?? '1 strip',
                        'description' => $resep->obat->kategori ?? 'Obat resep Klinik Sehati.'
                    ];
                }
            }

            // =========================================================================
            // 3. MERAKIT PAYLOAD AKHIR UNTUK HOME_SCREEN FLUTTER
            // =========================================================================
            $payloadBeranda = [
                'tanggal_hari_ini' => Carbon::now()->locale('id')->translatedFormat('l, d M Y'),
                'pasien' => [
                    'nama' => $pasien->nama ?? $user->name,
                ],
                'ringkasan' => [
                    'total_jadwal_kunjungan' => count($visitsPayload) . ' Jadwal',
                    'total_jadwal_obat' => count($medicinesPayload) . ' Jadwal',
                ],
                'visits' => $visitsPayload,
                'medicines' => $medicinesPayload
            ];

            return response()->json([
                'status' => 'success',
                'data' => $payloadBeranda
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses beranda riil: ' . $e->getMessage()], 500);
        }
    }
}