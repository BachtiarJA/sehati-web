import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Pill, Save, ArrowLeft, Search, Plus, Trash2 } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Pasien', href: '/pasien' },
    { title: 'Resep Obat', href: '/resep-obat' },
];
interface ResepObat {
    id: string;
    nama_obat: string;
    dosis: string;
    jumlah: number;
    waktu: string;
    berapa_kali: string;
    keterangan: string;
}

export default function Obat() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const idPasien = searchParams.get('pasien') || '';
    const namaPasien = searchParams.get('nama') || '';

    const [resepList, setResepList] = useState<ResepObat[]>([]);
    const [currentObat, setCurrentObat] = useState({
        nama_obat: '',
        dosis: '',
        jumlah: 1,
        waktu: '',
        berapa_kali: '',
        keterangan: ''
    });

    const handleAddObat = () => {
        if (!currentObat.nama_obat) return;

        setResepList([...resepList, {
            id: Date.now().toString(),
            ...currentObat
        }]);

        setCurrentObat({
            nama_obat: '',
            dosis: '',
            jumlah: 1,
            waktu: '',
            berapa_kali: '',
            keterangan: ''
        });
    };

    const handleRemoveObat = (id: string) => {
        setResepList(resepList.filter(obat => obat.id !== id));
    };

    const handleSimpanResep = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate saving data
        alert('Resep obat berhasil disimpan!');
        router.visit('/pasien');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Form Resep Obat" />
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => router.visit('/pasien')}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Manajemen Pasien
                </button>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                                <Pill size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Pemberian Resep Obat</h2>
                                <p className="text-sm text-slate-500 font-medium">Isi form di bawah untuk memberikan resep kepada pasien.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSimpanResep} className="space-y-6">
                            {/* Patient Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ID Pasien</label>
                                    <input
                                        type="text"
                                        value={idPasien}
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none"
                                        placeholder="Pilih dari daftar pasien"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Pasien</label>
                                    <input
                                        type="text"
                                        value={namaPasien}
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none"
                                        placeholder="Pilih dari daftar pasien"
                                    />
                                </div>
                            </div>

                            {/* Add Medicine Form */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-800">Daftar Obat</h3>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Nama Obat</label>
                                        <input
                                            type="text"
                                            value={currentObat.nama_obat}
                                            onChange={(e) => setCurrentObat({ ...currentObat, nama_obat: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                            placeholder="Mis: Paracetamol 500mg"
                                        />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Dosis</label>
                                        <input
                                            type="text"
                                            value={currentObat.dosis}
                                            onChange={(e) => setCurrentObat({ ...currentObat, dosis: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                            placeholder="Mis: 500mg"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Jumlah</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={currentObat.jumlah}
                                            onChange={(e) => setCurrentObat({ ...currentObat, jumlah: parseInt(e.target.value) || 1 })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Aturan / Frekuensi (Berapa Kali)</label>
                                        <input
                                            type="text"
                                            value={currentObat.berapa_kali}
                                            onChange={(e) => setCurrentObat({ ...currentObat, berapa_kali: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                            placeholder="Mis: 3 x Sehari"
                                        />
                                    </div>
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-medium text-slate-600 mb-2">Waktu Alarm Pengingat (Jam)</label>
                                        <input
                                            type="text"
                                            value={currentObat.waktu}
                                            onChange={(e) => setCurrentObat({ ...currentObat, waktu: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                            placeholder="Mis: 08:00, 14:00, 20:00"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <button
                                            type="button"
                                            onClick={handleAddObat}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors shadow-sm text-sm font-bold"
                                        >
                                            <Plus size={16} />
                                            Tambah
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Added Medicines List */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-200">
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Nama Obat</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Dosis</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Aturan</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Alarm Waktu</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Jumlah</th>
                                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {resepList.map((obat) => (
                                            <tr key={obat.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-bold text-slate-800">{obat.nama_obat}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{obat.dosis}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{obat.berapa_kali}</td>
                                                <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{obat.waktu}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600 text-center">{obat.jumlah}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveObat(obat.id)}
                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {resepList.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada obat yang ditambahkan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">Catatan / Keterangan Tambahan (Opsional)</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm resize-none"
                                    placeholder="Tambahkan catatan untuk apoteker atau pasien..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/pasien')}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={resepList.length === 0}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={16} />
                                    Simpan Resep
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
