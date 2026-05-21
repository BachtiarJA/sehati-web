<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Dokter; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 🌐 GET: Mengambil daftar dokter/khitan secara RIIL dari database
     */
    public function listDokter(Request $request)
    {
        // 1. Tangkap query parameter filter dari aplikasi Flutter
        $layanan = $request->query('layanan', 'dokter'); 
        $tanggalInput = $request->query('tanggal'); 
        
        // Standarisasi format tanggal pencarian
        $tanggal = $tanggalInput 
            ? Carbon::parse($tanggalInput)->toDateString() 
            : Carbon::today()->toDateString();

        // 2. Query data riil dari tabel 'dokter' berdasarkan kolom 'keahlian'
        $query = Dokter::query();

        if ($layanan === 'khitan') {
            // Jika memilih kategori khitan, cari yang keahliannya mengandung kata khitan
            $query->where('keahlian', 'like', '%khitan%');
        } else {
            // Jika memilih kategori dokter, cari yang keahliannya bukan khitan
            $query->where('keahlian', 'not like', '%khitan%');
        }

        $daftarDokter = $query->get();

        // 3. Transformasi data menjadi format yang dikenali oleh UI Flutter Medvora
        $dataDokterResponse = $daftarDokter->map(function ($doc) use ($tanggal) {
            
            // 💡 RIIL: Hitung jumlah antrean saat ini di tabel 'antrians' untuk dokter ini pada tanggal terpilih
            $estimasiAntrean = Antrian::where('dokter_id', $doc->id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->where('status', 'menunggu')
                ->count();

            return [
                'id' => $doc->id,
                'nama' => $doc->nama_dokter, // Sesuai kolom 'nama_dokter' di ERD
                'spesialis' => $doc->keahlian, // Sesuai kolom 'keahlian' di ERD
                'jam_praktik' => '08.00 - 14.00 WIB', // Default nilai estetika karena tidak ada di tabel
                'rating' => 4.8, // Default nilai karena tidak ada di tabel
                'estimasi_antrean' => $estimasiAntrean // Hasil hitung agregat riil database
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data jadwal dokter berhasil diambil secara riil',
            'data' => $dataDokterResponse
        ], 200);
    }

    /**
     * 📥 POST: Menyimpan transaksi booking antrian baru ke tabel 'antrians'
     */
    public function store(Request $request)
    {
        // Petakan input camelCase dari HTTP POST Flutter ke snake_case database Laravel kalian
        if ($request->has('doctorId')) {
            $request->merge([
                'dokter_id' => $request->doctorId,
                'tgl_kunjungan' => $request->selectedDate,
            ]);
        }

        // 1. Validasi Input (Memastikan dokter_id wajib ada di tabel 'dokter')
        $validator = Validator::make($request->all(), [
            'dokter_id' => 'required|exists:dokter,id', // Validasi strict ke tabel 'dokter' sesuai ERD
            'tgl_kunjungan' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // 2. Ambil Profil Pasien berdasarkan User yang sedang Login (Relasi tabel users -> pasiens)
            $user = $request->user();
            $pasien = $user->pasien;

            if (!$pasien) {
                return response()->json(['status' => 'error', 'message' => 'Profil pasien tidak ditemukan.'], 404);
            }

            $tanggal = $request->tgl_kunjungan
                ? Carbon::parse($request->tgl_kunjungan)->toDateString()
                : Carbon::today()->toDateString();

            // 3. Hitung no_antrian terakhir secara riil di tabel 'antrians'
            $antrianTerakhir = Antrian::where('dokter_id', $request->dokter_id)
                ->whereDate('tgl_kunjungan', $tanggal)
                ->max('no_antrian');

            $nomorBaru = $antrianTerakhir ? $antrianTerakhir + 1 : 1;

            // 4. Eksekusi Query INSERT ke tabel 'antrians' sesuai kolom ERD kalian
            $antrian = Antrian::create([
                'pasien_id' => $pasien->id,       // FK ke tabel pasiens
                'dokter_id' => $request->dokter_id, // FK ke tabel dokter
                'tgl_kunjungan' => $tanggal,
                'no_antrian' => $nomorBaru,
                'status' => 'menunggu',
            ]);

            // 5. Konstruksi Nomor Booking Elektronik untuk Nota Sukses di Flutter Screen
            $formatTanggalCode = Carbon::parse($antrian->tgl_kunjungan)->format('dmy');
            $formatNomorUrut = str_pad($antrian->no_antrian, 3, '0', STR_PAD_LEFT);
            $nomorBookingLive = "BK-{$formatTanggalCode}-{$formatNomorUrut}";

            return response()->json([
                'status' => 'success',
                'message' => 'Booking antrian berhasil disimpan ke database!',
                'data' => [
                    'no_antrian' => $antrian->no_antrian,
                    'nomor_booking' => $nomorBookingLive, 
                    'tgl_kunjungan' => Carbon::parse($antrian->tgl_kunjungan)->format('d M Y'),
                    'nama_pasien' => $pasien->nama, // Mengambil kolom 'nama' dari tabel pasiens
                    'status' => $antrian->status
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan server: ' . $e->getMessage()], 500);
        }
    }
}