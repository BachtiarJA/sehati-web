import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    Users,
    Activity,
    AlertTriangle,
    ArrowUpRight,
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

// 1. Definisikan tipe data Props dari Laravel
interface DashboardProps {
    dokter_name: string;
    stats: {
        total_kunjungan: number;
        antrian_aktif: number;
    };
    chart_data: {
        mingguan: any[];
        bulanan: any[];
    };
    activities: {
        type: 'selesai' | 'diperiksa' | 'baru';
        title: string;
        desc: string;
        time: string;
    }[];
}

// 2. Tangkap props di komponen utama
export default function Dashboard({ dokter_name, stats, chart_data, activities }: DashboardProps) {
    const [chartView, setChartView] = useState<'mingguan' | 'bulanan'>('mingguan');

    // 3. Gunakan data dinamis untuk chart
    const currentChartData = chartView === 'mingguan' ? chart_data.mingguan : chart_data.bulanan;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Utama" />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        {/* 4. Tampilkan Nama Dokter Dinamis */}
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Selamat Datang, {dokter_name} </h1>
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
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Kunjungan Hari Ini</p>
                                {/* 5. Tampilkan Total Kunjungan Dinamis */}
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-teal-600 transition-colors">
                                    {stats.total_kunjungan}
                                </h3>
                            </div>
                            <div className="p-3.5 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <Link href="/antrian" className="block group bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Antrian Menunggu</p>
                                {/* 6. Tampilkan Antrian Aktif Dinamis */}
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-500 transition-colors">
                                    {stats.antrian_aktif}
                                </h3>
                            </div>
                            <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-6 h-6" />
                            </div>
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
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPasien" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}
                                        itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="pasien" name="Total Pasien" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPasien)" activeDot={{ r: 6, strokeWidth: 0, fill: '#0d9488' }} />
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
                            {/* 7. Looping Aktivitas Terbaru dari Database */}
                            {activities.length > 0 ? activities.map((item, index) => (
                                <div key={index} className="flex gap-4 group cursor-pointer">
                                    <div className="mt-1 relative">
                                        {/* Ganti Icon/Warna Berdasarkan Tipe Aktivitas */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                                            item.type === 'selesai' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10' :
                                            item.type === 'diperiksa' ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' :
                                            'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
                                        }`}>
                                            {item.type === 'selesai' && <CheckCircle2 className="w-5 h-5" />}
                                            {item.type === 'diperiksa' && <Activity className="w-5 h-5" />}
                                            {item.type === 'baru' && <UserPlus className="w-5 h-5" />}
                                        </div>
                                        <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-slate-100 dark:bg-slate-700 group-last:hidden"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-semibold transition-colors ${
                                                item.type === 'selesai' ? 'group-hover:text-teal-600' :
                                                item.type === 'diperiksa' ? 'group-hover:text-amber-500' : 'group-hover:text-blue-500'
                                            } text-slate-900 dark:text-white`}>
                                                {item.title}
                                            </h4>
                                            <span className="text-xs font-medium text-slate-400">{item.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500 text-center mt-10">Belum ada aktivitas hari ini.</p>
                            )}
                        </div>

                        <Link href="/antrian" className="text-center w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all">
                            Lihat Semua Antrian
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
