import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, ChevronRight, FileText, History, Search, User, UserCircle } from 'lucide-react';
import { useState } from 'react';

interface Riwayat {
    id_pemeriksaan: number;
    tanggal: string;
    keluhan: string;
    diagnosa: string;
    tindakan: string;
    tb: number | null;
    bb: number | null;
    nama_dokter: string;
}

interface Pasien {
    id: number;
    nama: string;
    no_rm: string;
    total_kunjungan: number;
    terakhir_periksa: string;
    riwayat: Riwayat[];
}

interface Props {
    pasiens: Pasien[];
}

export default function RekamMedis({ pasiens = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

    // Filter daftar pasien berdasarkan pencarian
    const filteredPasiens = pasiens.filter(
        (p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.no_rm.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Rekam Medis', href: '/rekam-medis' }]}>
            <Head title="Rekam Medis Pasien" />

            <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col p-4 md:p-6 lg:p-8">
                <div className="flex h-full flex-col gap-6 md:flex-row">
                    {/* PANEL KIRI: DAFTAR PASIEN */}
                    <div className="flex h-full w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:w-1/3">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <History className="text-teal-600" size={20} />
                                Arsip Pasien
                            </h2>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau No RM..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-all outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-1 overflow-y-auto p-2">
                            {filteredPasiens.length > 0 ? (
                                filteredPasiens.map((pasien) => (
                                    <button
                                        key={pasien.id}
                                        onClick={() => setSelectedPasien(pasien)}
                                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                                            selectedPasien?.id === pasien.id
                                                ? 'border border-teal-200 bg-teal-50 shadow-sm'
                                                : 'border border-transparent hover:bg-slate-50'
                                        }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selectedPasien?.id === pasien.id ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            <User size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4
                                                className={`truncate text-sm font-bold ${selectedPasien?.id === pasien.id ? 'text-teal-900' : 'text-slate-700'}`}
                                            >
                                                {pasien.nama}
                                            </h4>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="font-mono text-xs font-medium text-slate-500">{pasien.no_rm}</span>
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                                    {pasien.total_kunjungan} Kunjungan
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={selectedPasien?.id === pasien.id ? 'text-teal-500' : 'text-slate-300'} />
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <UserCircle size={40} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Pasien tidak ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PANEL KANAN: DETAIL REKAM MEDIS & TIMELINE */}
                    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:w-2/3">
                        {selectedPasien ? (
                            <>
                                {/* Header Profil Pasien */}
                                <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow-sm">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-slate-800">{selectedPasien.nama}</h2>
                                            <div className="mt-1 flex items-center gap-3 text-sm font-medium text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <FileText size={14} className="text-slate-400" /> {selectedPasien.no_rm}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-slate-400" /> Terakhir: {selectedPasien.terakhir_periksa}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Riwayat */}
                                <div className="flex-1 overflow-y-auto bg-slate-50/30 p-6">
                                    <h3 className="mb-6 text-sm font-bold tracking-wider text-slate-400 uppercase">Riwayat Pemeriksaan</h3>

                                    {selectedPasien.riwayat.length > 0 ? (
                                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent md:before:mx-auto md:before:translate-x-0">
                                            {selectedPasien.riwayat.map((riwayat, index) => (
                                                <div
                                                    key={riwayat.id_pemeriksaan}
                                                    className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                                                >
                                                    {/* Titik Timeline */}
                                                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-500 text-white shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                        <Activity size={18} />
                                                    </div>

                                                    {/* Kartu Konten */}
                                                    <div className="w-[calc(100%-4rem)] rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-teal-100 hover:shadow-md md:w-[calc(50%-2.5rem)]">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                                                {riwayat.tanggal}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                                                                dr. {riwayat.nama_dokter}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {/* Tanda Vital (TB & BB) */}
                                                            {(riwayat.tb || riwayat.bb) && (
                                                                <div className="flex gap-3 border-b border-slate-50 pb-3">
                                                                    {riwayat.tb && (
                                                                        <div className="text-xs font-medium text-slate-500">
                                                                            <span className="text-slate-400">TB:</span> {riwayat.tb} cm
                                                                        </div>
                                                                    )}
                                                                    {riwayat.bb && (
                                                                        <div className="text-xs font-medium text-slate-500">
                                                                            <span className="text-slate-400">BB:</span> {riwayat.bb} kg
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="mb-1 text-xs font-bold text-slate-400 uppercase">Keluhan</p>
                                                                <p className="text-sm text-slate-700">{riwayat.keluhan}</p>
                                                            </div>

                                                            <div className="rounded-xl border border-rose-100/50 bg-rose-50/50 p-3">
                                                                <p className="mb-1 text-xs font-bold text-rose-400 uppercase">Diagnosa</p>
                                                                <p className="text-sm font-semibold text-rose-700">{riwayat.diagnosa}</p>
                                                            </div>

                                                            <div className="rounded-xl border border-emerald-100/50 bg-emerald-50/50 p-3">
                                                                <p className="mb-1 text-xs font-bold text-emerald-500 uppercase">Tindakan / Resep</p>
                                                                <p className="text-sm font-medium text-emerald-700">{riwayat.tindakan}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <FileText size={24} />
                                            </div>
                                            <h3 className="mb-1 font-bold text-slate-700">Belum ada rekam medis</h3>
                                            <p className="text-sm text-slate-500">Pasien ini belum memiliki riwayat pemeriksaan.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* State Kosong (Belum ada pasien yang diklik) */
                            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50">
                                    <History size={40} className="text-teal-500" />
                                    <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                                        <Search size={20} className="text-slate-300" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-800">Pilih Data Pasien</h3>
                                <p className="max-w-sm text-slate-500">
                                    Cari dan klik nama pasien pada panel di sebelah kiri untuk melihat arsip rekam medis selengkapnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
