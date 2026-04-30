import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, Download, Edit2, Plus, Save, Search, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface PemeriksaanData {
    id: number;
    nama_pasien: string;
    keluhan: string;
    diagnosa: string;
    tindakan: string;
    tanggal_raw: string;
    tanggal_format: string;
}

interface AntrianAktif {
    id: number;
    nama: string;
}

interface Props {
    pemeriksaans: PemeriksaanData[];
    antrianAktif: AntrianAktif[];
}

export default function Diagnosis({ pemeriksaans = [], antrianAktif = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    // 1. Tambahkan state untuk filter waktu
    const [filterWaktu, setFilterWaktu] = useState<'semua' | 'harian' | 'mingguan' | 'bulanan' | 'tanggal_tertentu'>('semua');
    // 2. Tambahkan state untuk menampung tanggal spesifik yang dipilih
    const [tanggalSpesifik, setTanggalSpesifik] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, reset, processing } = useForm({
        antrian_id: '',
        keluhan: '',
        diagnosa: '',
        tindakan: '',
    });

    const openAddModal = () => {
        setModalMode('add');
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: PemeriksaanData) => {
        setModalMode('edit');
        setEditId(item.id);
        setData({
            antrian_id: '',
            keluhan: item.keluhan,
            diagnosa: item.diagnosa,
            tindakan: item.tindakan,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post('/diagnosis', { onSuccess: () => handleCloseModal() });
        } else {
            put(`/diagnosis/${editId}`, { onSuccess: () => handleCloseModal() });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
            router.delete(`/diagnosis/${id}`);
        }
    };

    // 3. Logika Filtering Ganda (Teks & Waktu)
    const filteredData = pemeriksaans.filter((p) => {
        // Cek Pencarian Teks
        const matchSearch =
            p.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.diagnosa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.keluhan.toLowerCase().includes(searchTerm.toLowerCase());

        // Cek Filter Waktu
        let matchTime = true;
        const hariIni = new Date();
        const stringHariIni = `${hariIni.getFullYear()}-${String(hariIni.getMonth() + 1).padStart(2, '0')}-${String(hariIni.getDate()).padStart(2, '0')}`;

        if (filterWaktu === 'harian') {
            matchTime = p.tanggal_raw === stringHariIni;
        } else if (filterWaktu === 'mingguan') {
            const tanggalItem = new Date(p.tanggal_raw);
            const mingguLalu = new Date();
            mingguLalu.setDate(mingguLalu.getDate() - 7);
            matchTime = tanggalItem >= mingguLalu && tanggalItem <= hariIni;
        } else if (filterWaktu === 'bulanan') {
            matchTime = p.tanggal_raw.substring(0, 7) === stringHariIni.substring(0, 7);
        } else if (filterWaktu === 'tanggal_tertentu') {
            // Jika tanggal spesifik dipilih, cocokkan. Jika belum diisi, tampilkan semua.
            matchTime = tanggalSpesifik ? p.tanggal_raw === tanggalSpesifik : true;
        }

        return matchSearch && matchTime;
    });

    const exportToExcel = () => {
        if (filteredData.length === 0) {
            alert('Tidak ada data untuk di-export');
            return;
        }

        // 1. Format data agar rapi di Excel (Menentukan Header)
        const dataHanyaYangTampil = filteredData.map((item, index) => ({
            No: index + 1,
            'Tanggal Periksa': item.tanggal_format,
            'Nama Pasien': item.nama_pasien,
            Keluhan: item.keluhan,
            Diagnosa: item.diagnosa,
            Tindakan: item.tindakan,
        }));

        // 2. Buat Worksheet
        const ws = XLSX.utils.json_to_sheet(dataHanyaYangTampil);

        // 3. Buat Workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan Pemeriksaan');

        // 4. Generate File & Download
        const fileName = `Laporan_Pemeriksaan_${filterWaktu}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Hasil Pemeriksaan', href: '/diagnosis' }]}>
            <Head title="Hasil Pemeriksaan" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header Actions */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari Pasien, Diagnosa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none sm:w-64"
                            />
                        </div>

                        {/* Dropdown Filter Waktu */}
                        <div className="relative w-full sm:w-auto">
                            <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <select
                                value={filterWaktu}
                                onChange={(e) => {
                                    setFilterWaktu(e.target.value as any);
                                    if (e.target.value !== 'tanggal_tertentu') setTanggalSpesifik(''); // Reset jika ganti mode
                                }}
                                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-10 text-sm font-medium text-slate-700 shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none sm:w-44"
                            >
                                <option value="semua">Semua Waktu</option>
                                <option value="harian">Hari Ini</option>
                                <option value="mingguan">7 Hari Terakhir</option>
                                <option value="bulanan">Bulan Ini</option>
                                <option value="tanggal_tertentu">Pilih Tanggal</option>
                            </select>
                            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        {/* 4. MUNCULKAN INPUT TANGGAL JIKA "TANGGAL TERTENTU" DIPILIH */}
                        {filterWaktu === 'tanggal_tertentu' && (
                            <div className="animate-in zoom-in-95 w-full duration-200 sm:w-auto">
                                <input
                                    type="date"
                                    value={tanggalSpesifik}
                                    onChange={(e) => setTanggalSpesifik(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none sm:w-auto"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <button
                            onClick={exportToExcel}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
                        >
                            <Download size={16} />
                            Export
                        </button>
                        <button
                            onClick={openAddModal}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition-colors hover:bg-emerald-600 sm:w-auto"
                        >
                            <Plus size={16} />
                            Input Hasil
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Nama Pasien</th>
                                    <th className="w-1/4 px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Keluhan</th>
                                    <th className="w-1/4 px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Diagnosa</th>
                                    <th className="w-1/4 px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Tindakan</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="rounded-md border border-slate-200/60 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-500">
                                                {item.tanggal_format}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{item.nama_pasien}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px] truncate text-sm text-slate-600" title={item.keluhan}>
                                                {item.keluhan}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px] truncate text-sm text-slate-600" title={item.diagnosa}>
                                                {item.diagnosa}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px] truncate text-sm text-slate-600" title={item.tindakan}>
                                                {item.tindakan}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="rounded-lg border border-blue-200/50 bg-blue-50 p-1.5 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                                                    title="Edit Hasil"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="rounded-lg border border-rose-200/50 bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                                                    title="Hapus Hasil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Search size={48} className="mb-4 text-slate-300" />
                                                <p className="text-base font-medium text-slate-600">
                                                    {pemeriksaans.length === 0 ? 'Belum ada riwayat pemeriksaan.' : 'Data tidak ditemukan.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form (Sama seperti sebelumnya) */}
            {isModalOpen && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
                    <div className="animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-800">
                                {modalMode === 'add' ? 'Input Hasil Pemeriksaan' : 'Edit Hasil Pemeriksaan'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            {modalMode === 'add' && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Pilih Pasien (Dalam Pemeriksaan)</label>
                                    <select
                                        required
                                        value={data.antrian_id}
                                        onChange={(e) => setData('antrian_id', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                    >
                                        <option value="" disabled>
                                            -- Pilih Pasien --
                                        </option>
                                        {antrianAktif.map((antrian) => (
                                            <option key={antrian.id} value={antrian.id}>
                                                {antrian.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {antrianAktif.length === 0 && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            Tidak ada pasien yang berstatus "Sedang Diperiksa" di halaman antrian.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Keluhan Pasien</label>
                                <textarea
                                    required
                                    value={data.keluhan}
                                    onChange={(e) => setData('keluhan', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                    placeholder="Keluhan utama..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Diagnosa</label>
                                <textarea
                                    required
                                    value={data.diagnosa}
                                    onChange={(e) => setData('diagnosa', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                    placeholder="Hasil diagnosa dokter..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Tindakan</label>
                                <textarea
                                    required
                                    value={data.tindakan}
                                    onChange={(e) => setData('tindakan', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                                    placeholder="Tindakan yang diberikan..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition-colors hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
