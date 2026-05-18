import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, Clock, Save, Users } from 'lucide-react';
import { useState } from 'react';

interface JadwalHari {
    hari: string;
    is_aktif: boolean;
    jam_mulai: string;
    jam_selesai: string;
    durasi_per_pasien: number;
}

interface Props {
    dokter: any;
    jadwal: JadwalHari[];
}

export default function JadwalPraktek({ dokter, jadwal }: Props) {
    const [formData, setFormData] = useState<JadwalHari[]>(jadwal);
    const [isSaving, setIsSaving] = useState(false);

    // Fungsi untuk mengupdate state saat input berubah
    const handleChange = (index: number, field: keyof JadwalHari, value: any) => {
        const newData = [...formData];
        newData[index] = { ...newData[index], [field]: value };
        setFormData(newData);
    };

    // Fungsi untuk simpan ke database
    const handleSimpan = () => {
        setIsSaving(true);
        router.post(
            '/jadwal-praktek',
            { jadwal: formData as any },
            {
                onSuccess: () => {
                    alert('Jadwal praktek berhasil diperbarui!');
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Jadwal Praktek', href: '/jadwal-praktek' }]}>
            <Head title="Manajemen Jadwal Praktek" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                            <CalendarDays className="text-teal-600" />
                            Manajemen Jadwal Praktek
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Atur hari, jam buka, dan durasi pemeriksaan untuk <strong>dr. {dokter?.nama_dokter || 'Budi'}</strong>
                        </p>
                    </div>
                    <button
                        onClick={handleSimpan}
                        disabled={isSaving}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Hari</th>
                                    <th className="px-6 py-4">Status Buka</th>
                                    <th className="px-6 py-4">Jam Mulai</th>
                                    <th className="px-6 py-4">Jam Selesai</th>
                                    <th className="px-6 py-4">Durasi / Pasien</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formData.map((row, index) => (
                                    <tr key={row.hari} className={`transition-colors ${row.is_aktif ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        {/* Nama Hari */}
                                        <td className="px-6 py-4 font-bold text-slate-800">{row.hari}</td>

                                        {/* Toggle Status */}
                                        <td className="px-6 py-4">
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={row.is_aktif}
                                                    onChange={(e) => handleChange(index, 'is_aktif', e.target.checked)}
                                                />
                                                <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-teal-500 peer-focus:ring-4 peer-focus:ring-teal-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                                <span className={`ml-3 text-xs font-bold ${row.is_aktif ? 'text-teal-600' : 'text-slate-400'}`}>
                                                    {row.is_aktif ? 'Buka' : 'Tutup'}
                                                </span>
                                            </label>
                                        </td>

                                        {/* Jam Mulai */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className={row.is_aktif ? 'text-slate-400' : 'text-slate-200'} />
                                                <input
                                                    type="time"
                                                    disabled={!row.is_aktif}
                                                    value={row.jam_mulai}
                                                    onChange={(e) => handleChange(index, 'jam_mulai', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                            </div>
                                        </td>

                                        {/* Jam Selesai */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className={row.is_aktif ? 'text-slate-400' : 'text-slate-200'} />
                                                <input
                                                    type="time"
                                                    disabled={!row.is_aktif}
                                                    value={row.jam_selesai}
                                                    onChange={(e) => handleChange(index, 'jam_selesai', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                            </div>
                                        </td>

                                        {/* Durasi */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className={row.is_aktif ? 'text-slate-400' : 'text-slate-200'} />
                                                <select
                                                    disabled={!row.is_aktif}
                                                    value={row.durasi_per_pasien}
                                                    onChange={(e) => handleChange(index, 'durasi_per_pasien', parseInt(e.target.value))}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400"
                                                >
                                                    <option value={10}>10 Menit</option>
                                                    <option value={15}>15 Menit</option>
                                                    <option value={20}>20 Menit</option>
                                                    <option value={30}>30 Menit</option>
                                                    <option value={60}>60 Menit</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                    <strong>Informasi:</strong> Waktu jadwal yang Anda atur di sini akan langsung berlaku di aplikasi Mobile pasien. Sistem akan
                    otomatis memecah jam kerja Anda menjadi slot-slot kecil berdasarkan "Durasi per Pasien".
                </div>
            </div>
        </AppLayout>
    );
}
