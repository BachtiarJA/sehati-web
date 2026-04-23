import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Users,
    Clock,
    CircleCheck,
    Search,
    Filter,
    Play,
    MoreVertical,
    UserCheck
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Antrian',
        href: '/antrian',
    },
];

const mockQueue = [
    { id: 1, no: 'A001', name: 'Budi Santoso', poli: 'Poli Umum', status: 'dilayani', time: '08:00' },
    { id: 2, no: 'A002', name: 'Siti Aminah', poli: 'Poli Gigi', status: 'menunggu', time: '08:15' },
    { id: 3, no: 'A003', name: 'Ahmad Dahlan', poli: 'Poli Umum', status: 'menunggu', time: '08:30' },
    { id: 4, no: 'B001', name: 'Rina Marlina', poli: 'Poli Anak', status: 'selesai', time: '07:45' },
    { id: 5, no: 'A004', name: 'Joko Widodo', poli: 'Poli Umum', status: 'menunggu', time: '08:45' },
];

export default function Antrian() {

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'dilayani':
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
        switch(status) {
            case 'dilayani': return 'Sedang Dilayani';
            case 'menunggu': return 'Menunggu';
            case 'selesai': return 'Selesai';
            default: return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Antrian Pasien" />

            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Antrian 🏥</h1>
                        <p className="text-slate-500 mt-1">Kelola dan pantau antrian pasien hari ini secara real-time.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-500/30 transition-all font-medium transform hover:-translate-y-0.5">
                            <UserCheck className="w-4 h-4" />
                            Tambah Pasien
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
                    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Kunjungan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">45</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 ml-1" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Sedang Dilayani</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">3</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Menunggu</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <CircleCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Selesai</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">30</h3>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col min-h-[500px]">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="relative w-full sm:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama pasien, no antrian..."
                                className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm outline-none text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm font-medium">
                                <Filter className="w-4 h-4" />
                                Filter Poli
                            </button>
                        </div>
                    </div>

                    {/* Table / List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm">No. Antrian</th>
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm">Nama Pasien</th>
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm">Poli Tujuan</th>
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm">Jam Daftar</th>
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm">Status</th>
                                    <th className="pb-4 pt-2 px-4 font-semibold text-slate-500 text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockQueue.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-bold font-mono tracking-wide">
                                                {item.no}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-sm">
                                            {item.poli}
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 text-sm font-medium">
                                            {item.time} WIB
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                                                {item.status === 'dilayani' && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>}
                                                {item.status === 'menunggu' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                                {item.status === 'selesai' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {item.status === 'menunggu' && (
                                                <button className="px-3 py-1.5 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 rounded-lg font-semibold text-sm transition-colors mr-2">
                                                    Panggil
                                                </button>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-6">
                        <p className="text-sm text-slate-500">Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">5</span> dari 45 antrian</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Sebelumnya</button>
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Selanjutnya</button>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
