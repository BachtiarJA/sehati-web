import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, ClipboardList, Users } from 'lucide-react';
import { useState } from 'react'; // <-- IMPORT USESTATE
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// IMPORT SHADCN SELECT
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// --- 1. SIAPKAN VARIASI DATA UNTUK FILTER ---
const chartData = {
    '7_hari': [
        { label: 'Sen', pasien: 12 },
        { label: 'Sel', pasien: 19 },
        { label: 'Rab', pasien: 15 },
        { label: 'Kam', pasien: 22 },
        { label: 'Jum', pasien: 18 },
        { label: 'Sab', pasien: 25 },
        { label: 'Min', pasien: 10 },
    ],
    'bulan_ini': [
        { label: 'Minggu 1', pasien: 65 },
        { label: 'Minggu 2', pasien: 80 },
        { label: 'Minggu 3', pasien: 55 },
        { label: 'Minggu 4', pasien: 90 },
    ],
    'tahun_ini': [
        { label: 'Jan', pasien: 250 },
        { label: 'Feb', pasien: 310 },
        { label: 'Mar', pasien: 280 },
        { label: 'Apr', pasien: 150 },
    ]
};

export default function Dashboard() {
    
    const [activeFilter, setActiveFilter] = useState<'7_hari' | 'bulan_ini' | 'tahun_ini'>('7_hari');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Antrian Saat Ini</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground mt-1">Menunggu panggilan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pasien Hari Ini</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground mt-1">Umum & Khitan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai Diperiksa</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">16</div>
                            <p className="text-xs text-muted-foreground mt-1">Sudah diberi resep</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-1 flex-col rounded-xl shadow-none md:min-h-min min-h-[400px]">
                    {/* --- 3. TAMBAHKAN DROPDOWN FILTER DI HEADER CARD --- */}
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle>Statistik Kunjungan</CardTitle>
                            <CardDescription>Grafik jumlah pasien klinik.</CardDescription>
                        </div>

                        {/* Komponen Select Shadcn */}
                        <Select
                            value={activeFilter}
                            onValueChange={(value: any) => setActiveFilter(value)}
                        >
                            <SelectTrigger className="w-[150px] h-9 text-xs">
                                <SelectValue placeholder="Pilih Waktu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7_hari">7 Hari Terakhir</SelectItem>
                                <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                                <SelectItem value="tahun_ini">Tahun Ini</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>

                    <CardContent className="flex-1 pb-4 pt-4">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            {/* --- 4. DATA GRAFIK MENGGUNAKAN STATE --- */}
                            <BarChart data={chartData[activeFilter]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                <XAxis
                                    dataKey="label" // Ubah jadi "label" agar fleksibel (hari/minggu/bulan)
                                    tickLine={false}
                                    axisLine={false}
                                    className="text-xs font-medium fill-muted-foreground"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    className="text-xs font-medium fill-muted-foreground"
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                    contentStyle={{
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Bar dataKey="pasien" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
