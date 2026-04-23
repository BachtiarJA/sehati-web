import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    Users,
    Activity,
    Stethoscope,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    UserPlus,
    CheckCircle2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const weeklyData = [
    { name: 'Sen', pasien: 45, online: 20 },
    { name: 'Sel', pasien: 52, online: 25 },
    { name: 'Rab', pasien: 48, online: 22 },
    { name: 'Kam', pasien: 65, online: 35 },
    { name: 'Jum', pasien: 58, online: 30 },
    { name: 'Sab', pasien: 85, online: 50 },
    { name: 'Min', pasien: 42, online: 15 },
];

const monthlyData = [
    { name: 'Minggu 1', pasien: 350, online: 150 },
    { name: 'Minggu 2', pasien: 420, online: 210 },
    { name: 'Minggu 3', pasien: 380, online: 180 },
    { name: 'Minggu 4', pasien: 450, online: 240 },
];

export default function Dashboard() {
    const [chartView, setChartView] = useState<'mingguan' | 'bulanan'>('mingguan');
    const chartData = chartView === 'mingguan' ? weeklyData : monthlyData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Utama" />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Selamat Datang, Dr. Budi 👋</h1>
                        <p className="text-slate-500 mt-1">Berikut adalah ringkasan aktivitas klinik hari ini.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                            </span>
                            Sistem Online
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="group bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Kunjungan</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-teal-600 transition-colors">127</h3>
                            </div>
                            <div className="p-3.5 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                +12%
                            </span>
                            <span className="text-xs text-slate-400">vs kemarin</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <Link href="/antrian" className="block group bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Antrian Aktif</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-500 transition-colors">24</h3>
                            </div>
                            <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 px-2.5 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                +5 pasien
                            </span>
                            <span className="text-xs text-slate-400">per jam ini</span>
                        </div>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Kunjungan</h3>
                                <div className="flex items-center gap-2 mt-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg w-fit">
                                    <button
                                        onClick={() => setChartView('mingguan')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartView === 'mingguan' ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                    >
                                        Mingguan
                                    </button>
                                    <button
                                        onClick={() => setChartView('bulanan')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartView === 'bulanan' ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                    >
                                        Bulanan
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="w-3 h-3 rounded-full bg-teal-500"></div> Pasien Langsung
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div> Booking Online
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPasien" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                            padding: '16px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pasien"
                                        name="Pasien Langsung"
                                        stroke="#0d9488"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorPasien)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0d9488' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="online"
                                        name="Booking Online"
                                        stroke="#fb923c"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorOnline)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#fb923c' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Appts / Activities */}
                    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aktivitas Live</h3>
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col gap-6">
                            {/* Item 1 */}
                            <div className="flex gap-4 group cursor-pointer">
                                <div className="mt-1 relative">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">Pemeriksaan Selesai</h4>
                                        <span className="text-xs font-medium text-slate-400">2 mnt</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Pasien Bp. Ahmad - Poli Umum</p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-4 group cursor-pointer">
                                <div className="mt-1 relative">
                                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">Peringatan IGD</h4>
                                        <span className="text-xs font-medium text-slate-400">15 mnt</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Alarm tekanan darah tinggi di R. ICU</p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex gap-4 group cursor-pointer">
                                <div className="mt-1 relative">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">Antrian Tertunda</h4>
                                        <span className="text-xs font-medium text-slate-400">45 mnt</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Poli Gigi mengalami keterlambatan</p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex gap-4 group cursor-pointer">
                                <div className="mt-1 relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Pasien Baru</h4>
                                        <span className="text-xs font-medium text-slate-400">1 jam</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Pendaftaran via web berhasil</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all">
                            Lihat Semua Log
                        </button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
