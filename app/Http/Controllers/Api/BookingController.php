<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Dokter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // 💡 FIX: Import ini wajib ada untuk transaksi database!
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 🌐 GET: Mengambil daftar dokter/khitan secara RIIL dari database
     */
    public function listDokter(Request $request)
    {
        $layanan = $request->query('layanan', 'dokter'); 
        $tanggalInput = $request->query('tanggal'); 
        
        $tanggal = $tanggalInput 
            ? Carbon::parse($tanggalInput)->toDateString() 
            : Carbon::today()->toDateString();

        $namaHari = Carbon::parse($tanggal)->locale('id')->translatedFormat('l');

        $query = Dokter::query();

        if ($layanan === 'khitan') {
            $query->where('keahlian', 'like', '%khitan%');
        } else {
            $query->where('keahlian', 'not like', '%khitan%');
        }

        $daftarDokter = $query->get();

        $dataDokterResponse = $daftarDokter->map(function ($doc) use ($tanggal, $namaHari) {
            
            $estimasiAntrean = Antrian::where('dokter_id', $doc->id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->where('status', 'menunggu')
                ->count();

            $jadwal = \DB::table('jadwal_dokters')
                ->where('dokter_id', $doc->id)
                ->where('hari', 'like', '%' . $namaHari . '%')
                ->first();

            if ($jadwal && $jadwal->jam_mulai && $jadwal->jam_selesai) {
                $jamMulai = Carbon::parse($jadwal->jam_mulai)->format('H:i');
                $jamSelesai = Carbon::parse($jadwal->jam_selesai)->format('H:i');
            } else {
                $jamMulai = 'Libur';
                $jamSelesai = '';
            }

            return [
                'id' => $doc->id,
                'nama' => $doc->nama_dokter, 
                'spesialis' => $doc->keahlian, 
                'jam_mulai' => $jamMulai,     
                'jam_selesai' => $jamSelesai, 
                'estimasi_antrean' => $estimasiAntrean 
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data jadwal dokter berhasil diambil secara riil',
            'data' => $dataDokterResponse
        ], 200);
    }

    /**
     * 🌐 GET: Mengambil detail rekam medis dinamis berdasarkan antrian_id (FULL RELASI ERD)
     */
    public function detailRekamMedis($antrianId)
    {
        // Tarik data pemeriksaan berserta relasi resep, obat, dan dokter penanggung jawab
        $pemeriksaan = \App\Models\Pemeriksaan::with(['resepObats.obat', 'antrian.dokter'])
            ->where('antrian_id', $antrianId)
            ->first();

        // Keamanan ganda: Jika pasien klik tombol tapi dokter di poliklinik belum input rekam medis
        if (!$pemeriksaan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data detail rekam medis belum diterbitkan oleh dokter poliklinik.'
            ], 404);
        }

        $antrian = $pemeriksaan->antrian;

        // Formatisasi kode booking agar seragam dengan tampilan kartu (Contoh: BK-180526-001)
        $tglFormat = Carbon::parse($antrian->tgl_kunjungan)->format('dmy');
        $noPad = str_pad($antrian->no_antrian, 3, '0', STR_PAD_LEFT);
        $kodeBooking = "BK-{$tglFormat}-{$noPad}";

        return response()->json([
            'status' => 'success',
            'data' => [
                'id_pemeriksaan' => $pemeriksaan->id,
                'kode_booking' => $kodeBooking,
                'tgl_periksa' => Carbon::parse($antrian->tgl_kunjungan)->locale('id')->translatedFormat('d F Y'),
                'waktu_periksa' => Carbon::parse($antrian->jam_kunjungan)->format('H:i') . ' WIB',
                'dokter' => $antrian->dokter->nama_dokter,
                'poli' => $antrian->dokter->keahlian,
                'keluhan' => $pemeriksaan->keluhan,
                'diagnosa' => $pemeriksaan->diagnosa,
                'tindakan' => $pemeriksaan->tindakan,
                'fisik' => [
                    'berat_badan' => $pemeriksaan->berat_badan . ' kg',
                    'tinggi_badan' => $pemeriksaan->tinggi_badan . ' cm',
                ],
                'resep_obat' => $pemeriksaan->resepObats->map(function ($resep) {
                    return [
                        'nama_obat' => $resep->obat->nama_obat ?? 'Nama Obat',
                        'jenis' => $resep->obat->jenis ?? 'tablet',
                        'dosis' => $resep->dosis,
                        'jumlah' => $resep->jumlah . ' item',
                        'aturan_minum' => $resep->berapa_kali . 'x sehari (' . ($resep->keterangan ?? 'Sesudah makan') . ')',
                    ];
                })
            ]
        ], 200);
    }

    /**
     * 📥 POST: Menyimpan transaksi booking antrian baru ke database
     */
    public function store(Request $request)
    {
        $request->validate([
            'dokter_id' => 'required|exists:dokter,id',
            'tgl_kunjungan' => 'required|date',
        ]);

        $user = $request->user();
        $pasien = $user->pasien;

        if (!$pasien) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Profil pasien tidak ditemukan.'
            ], 404);
        }

        $isDoubleBooking = Antrian::where('pasien_id', $pasien->id)
            ->where('dokter_id', $request->dokter_id)
            ->whereDate('tgl_kunjungan', $request->tgl_kunjungan)
            ->where('status', 'menunggu')
            ->exists();

        if ($isDoubleBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah memiliki nomor antrean aktif untuk dokter ini pada tanggal tersebut.'
            ], 400);
        }

        try {
            return DB::transaction(function () use ($request, $pasien) {
                $tanggal = Carbon::parse($request->tgl_kunjungan)->toDateString();
                $namaHari = Carbon::parse($tanggal)->locale('id')->translatedFormat('l');

                $jadwal = DB::table('jadwal_dokters')
                    ->where('dokter_id', $request->dokter_id)
                    ->where('hari', 'like', '%' . $namaHari . '%')
                    ->first();

                $jamKunjungan = $jadwal ? $jadwal->jam_mulai : '08:00:00';

                $latestNoAntrian = Antrian::where('dokter_id', $request->dokter_id)
                    ->whereDate('tgl_kunjungan', $tanggal)
                    ->max('no_antrian');

                $noAntrianBaru = $latestNoAntrian ? $latestNoAntrian + 1 : 1;

                $antrian = Antrian::create([
                    'pasien_id' => $pasien->id,
                    'dokter_id' => $request->dokter_id,
                    'tgl_kunjungan' => $tanggal,
                    'jam_kunjungan' => $jamKunjungan,
                    'no_antrian' => $noAntrianBaru,
                    'status' => 'menunggu'
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Nomor antrean berhasil dipesan!',
                    'data' => [
                        'id_booking' => $antrian->id,
                        'no_antrian' => $antrian->no_antrian,
                        'jam_kunjungan' => Carbon::parse($antrian->jam_kunjungan)->format('H:i') . ' WIB'
                    ]
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage()
            ], 500);
        }
    }
}

