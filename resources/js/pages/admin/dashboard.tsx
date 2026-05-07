import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, Users, Stethoscope, Clock } from 'lucide-react';

const visitData = [
    { name: 'Senin', pasien: 45 },
    { name: 'Selasa', pasien: 52 },
    { name: 'Rabu', pasien: 38 },
    { name: 'Kamis', pasien: 65 },
    { name: 'Jumat', pasien: 48 },
    { name: 'Sabtu', pasien: 70 },
    { name: 'Minggu', pasien: 85 },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Admin', href: '/admin/dashboard' }]}>
            <Head title="Dashboard Admin" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-teal-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Ringkasan aktivitas dan metrik klinik Sehati Medika.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,248</div>
                            <p className="text-muted-foreground text-xs">+12% dari bulan lalu</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Dokter</CardTitle>
                            <Stethoscope className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-muted-foreground text-xs">2 dokter sedang cuti</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Kunjungan Hari Ini</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">42</div>
                            <p className="text-muted-foreground text-xs">15 antrean tersisa</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Status Operasional</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-600">Aktif</div>
                            <p className="text-muted-foreground text-xs">Sistem berjalan normal</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4 shadow-xs border-slate-200">
                        <CardHeader>
                            <CardTitle>Statistik Kunjungan Mingguan</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={visitData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                                        />
                                        <Line type="monotone" dataKey="pasien" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-3 shadow-xs border-slate-200">
                        <CardHeader>
                            <CardTitle>Dokter Bertugas Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Andi Saputra", spec: "Dokter Umum", time: "08:00 - 14:00" },
                                    { name: "Dr. Budi Santoso", spec: "Dokter Gigi", time: "09:00 - 15:00" },
                                    { name: "Dr. Clara Shinta", spec: "Dokter Anak", time: "14:00 - 20:00" },
                                    { name: "Dr. Dewi Lestari", spec: "Dokter Kandungan", time: "15:00 - 21:00" }
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                                            {doc.name.split(' ')[1].charAt(0)}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-slate-900">{doc.name}</p>
                                            <p className="text-muted-foreground text-sm">{doc.spec}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                                            {doc.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
