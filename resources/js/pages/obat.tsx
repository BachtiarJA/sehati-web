import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, Clock, Pill, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

// --- (Semua interface biarkan sama) ---
interface DataResep {
    id: number;
    tanggal: string;
    nama_pasien: string;
    nama_obat: string;
    dosis: string;
    jumlah: number;
    berapa_kali: string;
    waktu: string;
    berapa_hari: number;
    status_alarm: string;
    keterangan: string;
}
interface Pasien {
    id: number;
    nama: string;
    no_rm: string;
}
interface MasterObat {
    id: number;
    kode_obat: string;
    nama_obat: string;
}
interface Props {
    reseps?: DataResep[];
    pasiens?: Pasien[];
    obats?: MasterObat[];
}

// Interface untuk list sementara
interface ObatTemp {
    id_temp: string;
    obat_id: number;
    nama_obat: string;
    dosis: string;
    jumlah: number;
    berapa_kali: string;
    waktu: string;
    berapa_hari: number;
    keterangan: string;
}

export default function IndexResepObat({ reseps = [], pasiens = [], obats = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Utama untuk List Resep dan Pasien
    const [selectedPasienId, setSelectedPasienId] = useState('');
    const [resepList, setResepList] = useState<ObatTemp[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // State untuk Form Input per Obat
    const [currentObat, setCurrentObat] = useState({
        obat_id: '',
        dosis: '',
        jumlah: 1,
        berapa_kali: '',
        waktu: '',
        berapa_hari: 3,
        keterangan: '',
    });

    // 1. Fungsi Tambah ke List Sementara
    const handleAddToList = () => {
        if (!currentObat.obat_id) return alert('Pilih obat terlebih dahulu!');

        const selectedMasterObat = obats.find((o) => o.id.toString() === currentObat.obat_id);

        setResepList([
            ...resepList,
            {
                id_temp: Date.now().toString(),
                obat_id: parseInt(currentObat.obat_id),
                nama_obat: selectedMasterObat?.nama_obat || '',
                dosis: currentObat.dosis,
                jumlah: currentObat.jumlah,
                berapa_kali: currentObat.berapa_kali,
                waktu: currentObat.waktu,
                berapa_hari: currentObat.berapa_hari,
                keterangan: currentObat.keterangan,
            },
        ]);

        // Kosongkan form input obat (tapi biarkan pasien tetap terpilih)
        setCurrentObat({ obat_id: '', dosis: '', jumlah: 1, berapa_kali: '', waktu: '', berapa_hari: 3, keterangan: '' });
    };

    // 2. Fungsi Hapus dari List Sementara
    const handleRemoveFromList = (id_temp: string) => {
        setResepList(resepList.filter((obat) => obat.id_temp !== id_temp));
    };

    // 3. Fungsi Simpan Semua ke Database
    const handleSimpanSemua = () => {
        if (!selectedPasienId) return alert('Silakan pilih pasien terlebih dahulu!');
        if (resepList.length === 0) return alert('Belum ada obat di dalam daftar resep!');

        setIsProcessing(true);
        router.post(
            '/resep-obat',
            {
                pasien_id: selectedPasienId,
                obat_list: resepList as any,
            },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setResepList([]); // Kosongkan list
                    setSelectedPasienId(''); // Reset pasien
                    alert('Resep berhasil disimpan dan alarm aktif!');
                },
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    const filteredReseps = reseps.filter(
        (resep) =>
            resep.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) || resep.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Resep Obat', href: '/resep-obat' }]}>
            <Head title="Daftar Resep Obat" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* --- TABEL UTAMA (BISA DIBIARKAN SAMA SEPERTI SEBELUMNYA) --- */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <Pill size={22} className="text-slate-700" />
                        <h2 className="text-lg font-bold text-slate-800">Daftar Rincian Resep Obat</h2>
                    </div>

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari Pasien atau Obat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/20"
                        >
                            <Plus size={18} />
                            Tambah Resep
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-4">Pasien</th>
                                        <th className="px-4 py-4">Obat & Dosis</th>
                                        <th className="px-4 py-4">Aturan & Alarm</th>
                                        <th className="px-4 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredReseps.map((resep) => (
                                        <tr key={resep.id} className="transition-colors hover:bg-slate-50/50">
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-slate-800">{resep.nama_pasien}</div>
                                                <div className="text-[11px] text-slate-500">{resep.tanggal}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-slate-800">{resep.nama_obat}</div>
                                                <div className="text-xs text-slate-500">
                                                    {resep.dosis} • {resep.jumlah} Item
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-slate-700">{resep.berapa_kali}</div>
                                                <div className="mt-1 flex items-center gap-3 text-[11px] text-emerald-600">
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <Clock size={12} /> {resep.waktu}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <CalendarDays size={12} /> {resep.berapa_hari} Hari
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${resep.status_alarm === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {resep.status_alarm}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- MODAL POP-UP TAMBAH RESEP DENGAN LIST --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">
                        <div className="animate-in zoom-in-95 flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Resep Baru</h3>
                                    <p className="text-xs text-slate-500">Pilih pasien, tambahkan obat ke keranjang, lalu simpan.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setResepList([]);
                                    }}
                                    className="text-slate-400 hover:text-rose-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-1 flex-col overflow-y-auto md:flex-row">
                                {/* PANEL KIRI: FORM INPUT OBAT */}
                                <div className="w-full border-b border-slate-100 p-6 md:w-1/2 md:border-r md:border-b-0">
                                    <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                        <label className="mb-1.5 block text-xs font-bold text-emerald-800 uppercase">
                                            1. Pilih Pasien <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={selectedPasienId}
                                            onChange={(e) => setSelectedPasienId(e.target.value)}
                                            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        >
                                            <option value="">-- Pasien Antrian Selesai --</option>
                                            {pasiens.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nama}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="border-b border-slate-100 pb-2 text-sm font-bold text-slate-800">2. Form Resep Obat</h4>
                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase">Pilih Obat</label>
                                            <select
                                                value={currentObat.obat_id}
                                                onChange={(e) => setCurrentObat({ ...currentObat, obat_id: e.target.value })}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                            >
                                                <option value="">-- Katalog Obat --</option>
                                                {obats.map((o) => (
                                                    <option key={o.id} value={o.id}>
                                                        {o.nama_obat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase">Dosis</label>
                                                <input
                                                    type="text"
                                                    value={currentObat.dosis}
                                                    onChange={(e) => setCurrentObat({ ...currentObat, dosis: e.target.value })}
                                                    placeholder="Mis: 500mg"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase">Jumlah Item</label>
                                                <input
                                                    type="number"
                                                    value={currentObat.jumlah}
                                                    onChange={(e) => setCurrentObat({ ...currentObat, jumlah: parseInt(e.target.value) })}
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase">Aturan Pakai</label>
                                            <input
                                                type="text"
                                                value={currentObat.berapa_kali}
                                                onChange={(e) => setCurrentObat({ ...currentObat, berapa_kali: e.target.value })}
                                                placeholder="Mis: 3 x Sehari"
                                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3">
                                            <div className="col-span-2">
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-orange-800 uppercase">
                                                    <Clock size={12} /> Alarm Mobile
                                                </span>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[10px] font-semibold text-orange-700">Jam Minum</label>
                                                <input
                                                    type="text"
                                                    value={currentObat.waktu}
                                                    onChange={(e) => setCurrentObat({ ...currentObat, waktu: e.target.value })}
                                                    placeholder="08:00, 14:00"
                                                    className="w-full rounded-lg border border-orange-200 px-2 py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[10px] font-semibold text-orange-700">Durasi (Hari)</label>
                                                <input
                                                    type="number"
                                                    value={currentObat.berapa_hari}
                                                    onChange={(e) => setCurrentObat({ ...currentObat, berapa_hari: parseInt(e.target.value) })}
                                                    className="w-full rounded-lg border border-orange-200 px-2 py-1.5 text-xs outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddToList}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900"
                                        >
                                            <Plus size={16} /> Tambah ke Daftar Resep
                                        </button>
                                    </div>
                                </div>

                                {/* PANEL KANAN: LIST OBAT & SUBMIT */}
                                <div className="flex w-full flex-col bg-slate-50/50 p-6 md:w-1/2">
                                    <h4 className="mb-4 text-sm font-bold text-slate-800">3. Keranjang Resep</h4>

                                    <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                                        {resepList.length === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
                                                <Pill size={32} className="mb-2 opacity-20" />
                                                <p className="text-xs">Belum ada obat yang ditambahkan.</p>
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-slate-100">
                                                {resepList.map((obat, idx) => (
                                                    <li
                                                        key={obat.id_temp}
                                                        className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">
                                                                {idx + 1}. {obat.nama_obat}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500">
                                                                {obat.dosis} | {obat.berapa_kali} | {obat.jumlah} Item
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveFromList(obat.id_temp)}
                                                            className="rounded p-1.5 text-rose-500 hover:bg-rose-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSimpanSemua}
                                            disabled={isProcessing || resepList.length === 0}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-600 disabled:opacity-50"
                                        >
                                            <Save size={18} />
                                            {isProcessing ? 'Menyimpan...' : `Simpan ${resepList.length} Obat ke Database`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
