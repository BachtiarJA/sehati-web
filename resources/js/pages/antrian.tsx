import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleCheck, Clock, Play, Search, Stethoscope, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Antrian',
        href: '/antrian',
    },
];

// 1. Tipe data yang diterima dari Laravel
interface AntrianProps {
    antrians: {
        id: number;
        // no: string; <-- Dihapus
        name: string;
        status: string;
        time: string;
    }[];
    stats: {
        total: number;
        diperiksa: number;
        menunggu: number;
        selesai: number;
    };
}

// 2. Fungsi Komponen Utama
export default function Antrian({ antrians = [], stats = { total: 0, diperiksa: 0, menunggu: 0, selesai: 0 } }: AntrianProps) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'diperiksa':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'menunggu':
                return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'selesai':
                return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            default:
                return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'diperiksa':
                return 'Sedang Diperiksa';
            case 'menunggu':
                return 'Menunggu';
            case 'selesai':
                return 'Selesai';
            case 'batal':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Antrian Pasien" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 font-sans md:p-6 lg:p-8">
                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-start justify-between gap-4 duration-700 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Jadwal Pemeriksaan 🏥</h1>
                        <p className="mt-1 text-slate-500">Kelola dan pantau jadwal sesi pasien Anda hari ini.</p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-transform group-hover:scale-110 dark:bg-teal-500/10">
                            <Users className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Kunjungan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
                        </div>
                    </div>

                    <div className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-500/10">
                            <Play className="ml-1 h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Sedang Diperiksa</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.diperiksa}</h3>
                        </div>
                    </div>

                    <div className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 transition-transform group-hover:scale-110 dark:bg-amber-500/10">
                            <Clock className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Menunggu</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.menunggu}</h3>
                        </div>
                    </div>

                    <div className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-500/10">
                            <CircleCheck className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Selesai</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.selesai}</h3>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex min-h-[500px] flex-col rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm backdrop-blur-xl md:p-8 dark:border-slate-700/50 dark:bg-slate-800/80">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="group relative w-full sm:w-96">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                <Search className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama pasien..."
                                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-11 text-sm text-slate-800 transition-all outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    {/* Table / List */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                    <th className="px-4 pt-2 pb-4 text-sm font-semibold text-slate-500">Jam Sesi</th>
                                    <th className="px-4 pt-2 pb-4 text-sm font-semibold text-slate-500">Nama Pasien</th>
                                    <th className="px-4 pt-2 pb-4 text-sm font-semibold text-slate-500">Status</th>
                                    <th className="px-4 pt-2 pb-4 text-right text-sm font-semibold text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {antrians.length > 0 ? (
                                    antrians.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                                        >
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 font-mono text-sm font-bold tracking-wide text-white">
                                                    <Clock size={14} />
                                                    {item.time} WIB
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(item.status)}`}
                                                >
                                                    {item.status === 'diperiksa' && (
                                                        <span className="relative mr-1 flex h-2 w-2">
                                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                                                        </span>
                                                    )}
                                                    {item.status === 'menunggu' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>}
                                                    {item.status === 'selesai' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {item.status === 'menunggu' && (
                                                    <Link
                                                        href={`/antrian/${item.id}/periksa`}
                                                        method="patch"
                                                        as="button"
                                                        className="mr-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20"
                                                    >
                                                        <Stethoscope className="h-4 w-4" />
                                                        Periksa
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-500">
                                            Belum ada pasien yang dijadwalkan untuk hari ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-700/50">
                        <p className="text-sm text-slate-500">
                            Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span> jadwal sesi hari ini
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
