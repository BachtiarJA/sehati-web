import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Clock, Stethoscope, Users } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
    name: string;
    pasien: number;
}

interface DokterInfo {
    name: string;
    spec: string;
    time: string;
}

interface Props {
    totalPasien: number;
    totalDokter: number;
    kunjunganHariIni: number;
    antreanTersisa: number;
    visitData: ChartData[];
    dokterBertugas: DokterInfo[];
}

export default function AdminDashboard({ totalPasien, totalDokter, kunjunganHariIni, antreanTersisa, visitData, dokterBertugas }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Admin', href: '/admin/dashboard' }]}>
            <Head title="Dashboard Admin" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-teal-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Ringkasan aktivitas dan metrik klinik Sehati Medika.</p>
                </div>

                {/* Grid diubah menjadi grid-cols-3 karena Card Status Operasional dihapus */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPasien}</div>
                            <p className="text-muted-foreground text-xs">Tercatat dalam database</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Dokter</CardTitle>
                            <Stethoscope className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDokter}</div>
                            <p className="text-muted-foreground text-xs">Dokter yang terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Kunjungan Hari Ini</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kunjunganHariIni}</div>
                            <p className="text-muted-foreground text-xs">{antreanTersisa} antrean berstatus menunggu</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="border-slate-200 shadow-xs lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Statistik Kunjungan 7 Hari Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={visitData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="pasien"
                                            stroke="#0f766e"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-xs lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Dokter Bertugas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {dokterBertugas.length > 0 ? (
                                    dokterBertugas.map((doc, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                                                {/* Mengambil inisial huruf pertama nama */}
                                                {doc.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm leading-none font-medium text-slate-900">{doc.name}</p>
                                                <p className="text-muted-foreground text-sm">{doc.spec}</p>
                                            </div>
                                            <div className="ml-auto rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                {doc.time}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-sm text-slate-500">Belum ada data dokter.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
