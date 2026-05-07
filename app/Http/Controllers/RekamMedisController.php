<?php

namespace App\Http\Controllers;

use App\Models\Pasien;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

class RekamMedisController extends Controller
{
    public function index()
    {
        // Ambil semua data pasien beserta riwayat antrian dan pemeriksaannya
        $pasiens = Pasien::with(['antrians.pemeriksaan', 'antrians.dokter'])
            ->get()
            ->map(function ($pasien) {

                // 1. Filter antrian yang sudah ada pemeriksaannya
                // 2. Urutkan berdasarkan tanggal dibuatnya PEMERIKSAAN dari yang paling baru
                $riwayat = $pasien->antrians
                    ->whereNotNull('pemeriksaan')
                    ->sortByDesc(function ($antrian) {
                    return $antrian->pemeriksaan->created_at;
                })
                    ->map(function ($antrian) {
                    return [
                        'id_pemeriksaan' => $antrian->pemeriksaan->id,
                        'tanggal' => $antrian->pemeriksaan->created_at->format('d M Y'),
                        'keluhan' => $antrian->pemeriksaan->keluhan,
                        'diagnosa' => $antrian->pemeriksaan->diagnosa,
                        'tindakan' => $antrian->pemeriksaan->tindakan,
                        'tb' => $antrian->pemeriksaan->tinggi_badan,
                        'bb' => $antrian->pemeriksaan->berat_badan,

                        // NAMA DOKTER HARUSNYA DI SINI (Di dalam map riwayat)
                        'nama_dokter' => $antrian->dokter->nama_dokter ?? 'Tidak Diketahui'
                    ];
                })->values();

                // KEMBALIKAN DATA PASIEN (Pastikan 'nama' ada di sini!)
                return [
                    'id' => $pasien->id,
                    'nama' => $pasien->nama, // <--- KEMBALIKAN BARIS INI YANG SEMPAT TERHAPUS
                    'no_rm' => 'RM-' . str_pad($pasien->id, 4, '0', STR_PAD_LEFT),
                    'total_kunjungan' => $riwayat->count(),
                    'terakhir_periksa' => $riwayat->first()['tanggal'] ?? 'Belum ada riwayat',
                    'riwayat' => $riwayat
                ];
            });

        return Inertia::render('rekam-medis', [
            'pasiens' => $pasiens
        ]);
    }
    public function exportWord($id)
    {
        // 1. Ambil data pasien beserta riwayatnya
        $pasien = Pasien::with(['antrians.pemeriksaan', 'antrians.dokter'])->findOrFail($id);

        $riwayat = $pasien->antrians->whereNotNull('pemeriksaan')->sortByDesc(function ($antrian) {
            return $antrian->pemeriksaan->created_at;
        });

        // 2. Inisialisasi PhpWord
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();

        // 3. Tambahkan Judul Dokumen
        $section->addText('REKAM MEDIS PASIEN', ['bold' => true, 'size' => 16], ['alignment' => 'center']);
        $section->addTextBreak(1); // Jarak 1 baris (Enter)

        // 4. Tambahkan Informasi Pasien
        $noRm = 'RM-' . str_pad($pasien->id, 4, '0', STR_PAD_LEFT);
        $section->addText('Nomor RM      : ' . $noRm, ['bold' => true]);
        $section->addText('Nama Pasien   : ' . $pasien->nama);
        $section->addText('Jenis Kelamin : ' . $pasien->jenis_kelamin);
        $section->addText('Umur          : ' . $pasien->umur . ' Tahun');
        $section->addText('Alamat        : ' . $pasien->alamat);

        $section->addTextBreak(1);

        // 5. Buat Tabel Riwayat Pemeriksaan
        $section->addText('RIWAYAT PEMERIKSAAN KESEHATAN:', ['bold' => true, 'size' => 12]);
        $section->addTextBreak(1);

        // Gaya (Style) Tabel: Garis tepi warna hitam
        $tableStyle = ['borderSize' => 6, 'borderColor' => '000000', 'cellMargin' => 80];
        $phpWord->addTableStyle('RiwayatTable', $tableStyle);
        $table = $section->addTable('RiwayatTable');

        // Baris Header Tabel
        $table->addRow();
        $table->addCell(1500, ['bgColor' => 'E0E0E0'])->addText('Tanggal', ['bold' => true]);
        $table->addCell(2000, ['bgColor' => 'E0E0E0'])->addText('Dokter', ['bold' => true]);
        $table->addCell(2500, ['bgColor' => 'E0E0E0'])->addText('Keluhan', ['bold' => true]);
        $table->addCell(2500, ['bgColor' => 'E0E0E0'])->addText('Diagnosa', ['bold' => true]);
        $table->addCell(2000, ['bgColor' => 'E0E0E0'])->addText('Tindakan', ['bold' => true]);

        // Isi Tabel dengan data riwayat (Looping)
        foreach ($riwayat as $antrian) {
            $table->addRow();
            $table->addCell(1500)->addText($antrian->pemeriksaan->created_at->format('d M Y'));
            $table->addCell(2000)->addText($antrian->dokter->nama_dokter ?? '-');
            $table->addCell(2500)->addText($antrian->pemeriksaan->keluhan ?? '-');
            $table->addCell(2500)->addText($antrian->pemeriksaan->diagnosa ?? '-');
            $table->addCell(2000)->addText($antrian->pemeriksaan->tindakan ?? '-');
        }

        // 6. Simpan File Sementara dan Kirim untuk di-Download
        $fileName = 'Rekam_Medis_' . str_replace(' ', '_', $pasien->nama) . '.docx';

        // Simpan ke direktori temp server
        $tempFile = tempnam(sys_get_temp_dir(), 'PHPWord');
        $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        // Download file tersebut, lalu langsung otomatis hapus file temp-nya agar server tidak penuh
        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }
}
