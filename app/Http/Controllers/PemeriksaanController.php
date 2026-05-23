<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Pemeriksaan;
use App\Models\JadwalMinumObat; // 💡 FIX 1: Wajib di-import agar baris create jadwal tidak error
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // 💡 FIX 2: Wajib di-import untuk kebutuhan DB::transaction
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

class PemeriksaanController extends Controller
{
    public function index()
    {
        $dokter = Auth::user()->dokter;

        // 1. Ambil riwayat pemeriksaan pasien untuk tabel
        $pemeriksaans = Pemeriksaan::with('antrian.pasien')
            ->whereHas('antrian', function ($query) use ($dokter) {
                $query->where('dokter_id', $dokter->id);
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama_pasien' => $p->antrian->pasien->nama ?? 'Unknown',
                    'tinggi_badan' => $p->tinggi_badan,
                    'berat_badan' => $p->berat_badan,
                    'keluhan' => $p->keluhan,
                    'diagnosa' => $p->diagnosa,
                    'tindakan' => $p->tindakan,
                    'tanggal_raw' => $p->created_at->format('Y-m-d'),
                    'tanggal_format' => $p->created_at->format('d M Y'),
                ];
            });

        // 2. Ambil antrian yang statusnya HANYA 'diperiksa' untuk Dropdown
        $antrianAktif = Antrian::with('pasien')
            ->where('dokter_id', $dokter->id)
            ->where('status', 'diperiksa')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'nama' => $a->pasien->nama . ' (A' . str_pad($a->no_antrian, 3, '0', STR_PAD_LEFT) . ')'
                ];
            });

        // Kirim ke React
        return Inertia::render('diagnosis', [
            'pemeriksaans' => $pemeriksaans,
            'antrianAktif' => $antrianAktif
        ]);
    }

    // Fungsi Simpan Data Baru (FIXED & AMAN)
    public function store(Request $request)
    {
        $request->validate([
            'antrian_id' => 'required',
            'tinggi_badan' => 'required|numeric',
            'berat_badan' => 'required|numeric',
            'keluhan' => 'required',
            'diagnosa' => 'required',
            'tindakan' => 'required',
        ]);

        return DB::transaction(function () use ($request) {

            // 💡 FIX 3: Tangkap hasil create ke dalam variabel $pemeriksaan
            $pemeriksaan = Pemeriksaan::create($request->all());

            // Sekarang variabel $pemeriksaan->id sudah valid dan bisa dibaca fungsi generator
            $this->generateJadwalMinumObat($pemeriksaan->id);

            // Otomatis ubah status antrian pasien menjadi 'selesai'
            Antrian::where('id', $request->antrian_id)->update(['status' => 'selesai']);

            return redirect()->back();
        });
    }  

    // Fungsi Update Data
    public function update(Request $request, $id)
    {
        $request->validate([
            'tinggi_badan' => 'required|numeric',
            'berat_badan' => 'required|numeric',
            'keluhan' => 'required',
            'diagnosa' => 'required',
            'tindakan' => 'required',
        ]);

        $pemeriksaan = Pemeriksaan::findOrFail($id);
        $pemeriksaan->update($request->only(['tinggi_badan', 'berat_badan', 'keluhan', 'diagnosa', 'tindakan']));

        return redirect()->back();
    }

    public function exportWord(Request $request, $id)
    {
        $pemeriksaan = Pemeriksaan::with(['antrian.pasien', 'antrian.dokter'])->findOrFail($id);
        $pasien = $pemeriksaan->antrian->pasien;
        $dokter = $pemeriksaan->antrian->dokter;

        $lamaIstirahat = $request->query('lama_istirahat', 3);
        $tglMulai = Carbon::parse($request->query('tanggal_mulai', now()));
        $tglSelesai = $tglMulai->copy()->addDays($lamaIstirahat - 1);

        $phpWord = new PhpWord();
        $section = $phpWord->addSection();

        $section->addText('KLINIK SEHATI MEDIKA', ['bold' => true, 'size' => 16], ['alignment' => 'center']);
        $section->addText('Jl. Danau Toba No.31, Lingkungan Panji, Tegalgede, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68124', ['size' => 10], ['alignment' => 'center']);
        $section->addText('Telp: 0822-1013-0822', ['size' => 10], ['alignment' => 'center']);
        $section->addText('====================================================', [], ['alignment' => 'center']);
        $section->addTextBreak(1);

        $section->addText('SURAT KETERANGAN SAKIT', ['bold' => true, 'size' => 14, 'underline' => 'single'], ['alignment' => 'center']);
        $section->addTextBreak(1);

        $section->addText('Yang bertanda tangan di bawah ini menerangkan bahwa:', ['size' => 12]);
        $section->addText('Nama               : ' . $pasien->nama, ['size' => 12]);
        $section->addText('Umur               : ' . $pasien->umur . ' Tahun', ['size' => 12]);
        $section->addText('Jenis Kelamin      : ' . $pasien->jenis_kelamin, ['size' => 12]);
        $section->addText('Alamat             : ' . $pasien->alamat, ['size' => 12]);
        $section->addTextBreak(1);

        $isi = "Pasien tersebut di atas berdasarkan hasil pemeriksaan didiagnosa mengalami {$pemeriksaan->diagnosa}, sehingga memerlukan istirahat selama {$lamaIstirahat} hari, terhitung mulai tanggal " . $tglMulai->translatedFormat('d F Y') . " sampai dengan " . $tglSelesai->translatedFormat('d F Y') . ".";

        $section->addText($isi, ['size' => 12]);
        $section->addText('Demikian surat keterangan ini diberikan untuk diketahui dan dapat dipergunakan sebagaimana mestinya.', ['size' => 12]);
        $section->addTextBreak(2);

        $section->addText('Dikeluarkan pada tanggal: ' . now()->translatedFormat('d F Y'), ['size' => 12], ['alignment' => 'right']);
        $section->addText('Dokter Pemeriksa,', ['size' => 12], ['alignment' => 'right']);
        $section->addTextBreak(3);
        $section->addText($dokter->nama_dokter, ['bold' => true, 'size' => 12, 'underline' => 'single'], ['alignment' => 'right']);
        $section->addText('SIP: ' . $dokter->no_str, ['size' => 10], ['alignment' => 'right']);

        $fileName = 'Surat_Sakit_' . str_replace(' ', '_', $pasien->nama) . '.docx';
        $tempFile = storage_path('app/public/' . $fileName);

        $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        return response()->download($tempFile)->deleteFileAfterSend(true);
    }

    public function destroy($id)
    {
        Pemeriksaan::destroy($id);
        return redirect()->back();
    }

    private function generateJadwalMinumObat($pemeriksaanId)
    {
        $pemeriksaan = Pemeriksaan::with('resepObats')->find($pemeriksaanId);

        if (!$pemeriksaan || $pemeriksaan->resepObats->isEmpty()) {
            return;
        }

        $tanggalMulai = Carbon::today('Asia/Jakarta');

        foreach ($pemeriksaan->resepObats as $resep) {
            $berapaKali = (int) $resep->berapa_kali; 
            $berapaHari = (int) $resep->berapa_hari; 

            $plotJam = [];
            if ($berapaKali === 1) {
                $plotJam = ['07:00:00']; 
            } elseif ($berapaKali === 2) {
                $plotJam = ['07:00:00', '19:00:00']; 
            } elseif ($berapaKali === 3) {
                $plotJam = ['07:00:00', '13:00:00', '19:00:00'];  
            } else {
                $plotJam = ['07:00:00']; 
            }

            for ($hari = 0; $hari < $berapaHari; $hari++) {
                $targetTanggal = $tanggalMulai->copy()->addDays($hari)->toDateString();

                foreach ($plotJam as $jam) {
                    $datetimeJadwal = Carbon::parse($targetTanggal . ' ' . $jam);

                    JadwalMinumObat::create([
                        'pemeriksaan_id' => $pemeriksaan->id,
                        'waktu_jadwal'   => $datetimeJadwal,
                        'waktu_aktual'   => null,
                        'status'         => 'belum',
                    ]);
                }
            }
        }
    }
}