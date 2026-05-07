import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Pill, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Obat {
    id: number;
    kode_obat: string;
    nama_obat: string;
    kategori: string;
    jenis: string;
}

interface Props {
    obats: Obat[];
    nextKode: string;
}

export default function DaftarObat({ obats = [], nextKode }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Inisialisasi useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_obat: '',
        kategori: '',
        jenis: 'tablet',
    });

    // 2. Fungsi untuk submit form
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/daftar-obat', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset(); // Kosongkan form jika berhasil
            },
        });
    };

    const handleDelete = (id: number, namaObat: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus obat "${namaObat}" dari katalog?`)) {
            router.delete(`/admin/daftar-obat/${id}`);
        }
    };

    const filteredObats = obats.filter(
        (obat) =>
            obat.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (obat.kode_obat && obat.kode_obat.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (obat.kategori && obat.kategori.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const getJenisColor = (jenis: string) => {
        const colors: Record<string, string> = {
            tablet: 'bg-blue-100 text-blue-700 border-blue-200',
            kapsul: 'bg-purple-100 text-purple-700 border-purple-200',
            sirup: 'bg-orange-100 text-orange-700 border-orange-200',
            salep: 'bg-pink-100 text-pink-700 border-pink-200',
            injeksi: 'bg-rose-100 text-rose-700 border-rose-200',
            botol: 'bg-teal-100 text-teal-700 border-teal-200',
        };
        return colors[jenis] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Daftar Obat', href: '/admin/daftar-obat' }]}>
            <Head title="Daftar Obat" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                            <Pill size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Katalog Obat Klinik</h1>
                            <p className="text-sm text-slate-500">Kelola daftar obat standar untuk resep dokter.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama obat atau kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-600 focus:ring-4 focus:ring-teal-500/20"
                    >
                        <Plus size={18} />
                        Tambah Obat
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Kode Obat</th>
                                    <th className="px-6 py-4">Nama Obat</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Jenis / Sediaan</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredObats.length > 0 ? (
                                    filteredObats.map((obat) => (
                                        <tr key={obat.id} className="transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-mono text-slate-500">{obat.kode_obat || '-'}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{obat.nama_obat}</td>
                                            <td className="px-6 py-4 text-slate-600">{obat.kategori || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${getJenisColor(obat.jenis)}`}
                                                >
                                                    {obat.jenis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(obat.id, obat.nama_obat)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            <Pill size={40} className="mx-auto mb-3 opacity-20" />
                                            <p>Data obat tidak ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
                        <div className="animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
                                <h3 className="text-lg font-bold text-slate-800">Tambah Katalog Obat</h3>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        reset();
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* 3. Sambungkan event onSubmit */}
                            <form onSubmit={submit} className="space-y-5 p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Kode Obat</label>
                                        <input
                                            type="text"
                                            value={nextKode} // <--- Menggunakan kode dari backend
                                            disabled // Dimatikan agar tidak bisa diketik
                                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Jenis / Sediaan</label>
                                        <select
                                            value={data.jenis}
                                            onChange={(e) => setData('jenis', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                        >
                                            <option value="tablet">Tablet</option>
                                            <option value="kapsul">Kapsul</option>
                                            <option value="sirup">Sirup</option>
                                            <option value="salep">Salep</option>
                                            <option value="injeksi">Injeksi</option>
                                        </select>
                                        {errors.jenis && <div className="mt-1 text-xs text-rose-500">{errors.jenis}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">
                                        Nama Obat <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_obat}
                                        onChange={(e) => setData('nama_obat', e.target.value)}
                                        placeholder="Mis: Paracetamol 500mg"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    />
                                    {errors.nama_obat && <div className="mt-1 text-xs text-rose-500">{errors.nama_obat}</div>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-600 uppercase">Kategori</label>
                                    <input
                                        type="text"
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        placeholder="Mis: Analgesik, Antibiotik"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    />
                                    {errors.kategori && <div className="mt-1 text-xs text-rose-500">{errors.kategori}</div>}
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            reset();
                                        }}
                                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-teal-500/20 hover:bg-teal-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
