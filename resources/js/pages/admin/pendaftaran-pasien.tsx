import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Activity, CalendarDays, CheckCircle2, ClipboardList, Clock, Filter, Search, User, UserPlus } from 'lucide-react';
import { useState } from 'react';

// Interfaces
interface Pasien {
    id: number;
    user_id: number;
    nama: string;
    jenis_kelamin: string;
    umur: number;
    alamat: string;
    email?: string;
    antrean_hari_ini?: string | null;
}

interface Dokter {
    id: number;
    nama_dokter: string;
    keahlian: string;
}

interface Antrean {
    id: number;
    dokter_id: number; // <--- [BARU] Ditambahkan untuk filter
    nama_pasien: string;
    nama_dokter: string;
    poli: string;
    jam_kunjungan: string;
    status: string;
}

interface Props {
    pasiens?: Pasien[];
    dokters?: Dokter[];
    antreans?: Antrean[];
}

export default function PendaftaranPasien({ pasiens = [], dokters = [], antreans = [] }: Props) {
    const [isPasienDialogOpen, setIsPasienDialogOpen] = useState(false);
    const [isAntreanDialogOpen, setIsAntreanDialogOpen] = useState(false);
    const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // [BARU] State untuk menyimpan ID dokter yang dipilih di filter
    const [filterDokterId, setFilterDokterId] = useState<string>('semua');

    // Filter pencarian nama pasien
    const filteredPasiens = pasiens.filter(
        (p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // [BARU] Logika filter tabel Antrean berdasarkan Dropdown Dokter
    const filteredAntreans = antreans.filter((antrean) => {
        if (filterDokterId === 'semua') return true;
        return antrean.dokter_id.toString() === filterDokterId;
    });

    const daftarPoli = Array.from(new Set(dokters.map((d) => d.keahlian)));

    // Form Pasien Baru
    const formPasien = useForm({
        nama: '',
        email: '',
        password: '',
        jenis_kelamin: '',
        umur: '',
        alamat: '',
    });

    // Form Pendaftaran Antrean
    const formAntrean = useForm({
        pasien_id: '',
        poli: '',
        dokter_id: '',
        tgl_kunjungan: new Date().toISOString().split('T')[0],
        jam_kunjungan: '',
    });

    const submitPasien = (e: React.FormEvent) => {
        e.preventDefault();
        formPasien.post('/admin/pendaftaran/akun-baru', {
            onSuccess: () => {
                setIsPasienDialogOpen(false);
                formPasien.reset();
                alert('Akun Pasien berhasil dibuat!');
            },
        });
    };

    const openAntreanDialog = (pasien: Pasien) => {
        setSelectedPasien(pasien);
        formAntrean.clearErrors();
        formAntrean.setData({
            ...formAntrean.data,
            pasien_id: pasien.id.toString(),
            tgl_kunjungan: new Date().toISOString().split('T')[0],
            jam_kunjungan: '',
        });
        setIsAntreanDialogOpen(true);
    };

    const submitAntrean = (e: React.FormEvent) => {
        e.preventDefault();
        formAntrean.post('/admin/pendaftaran/antrian', {
            onSuccess: () => {
                setIsAntreanDialogOpen(false);
                formAntrean.reset();
                setSelectedPasien(null);
                alert('Pasien berhasil di-booking ke jadwal tersebut!');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pendaftaran & Antrean', href: '/admin/pendaftaran' }]}>
            <Head title="Manajemen Pasien" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* ===== BANNER HEADER ===== */}
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-8 text-center shadow-sm sm:flex-row sm:p-10 sm:text-left">
                    <div className="rounded-full bg-white p-4 text-6xl shadow-sm">🏥</div>
                    <div>
                        <h1 className="mb-2 text-3xl font-extrabold text-teal-800">Pendaftaran & Booking Sesi</h1>
                        <p className="text-sm font-medium text-slate-500">
                            Cari pasien dan pilih slot waktu pemeriksaan, atau buat akun pasien baru.
                        </p>
                    </div>
                </div>

                {/* ===== CARD TABEL PASIEN ===== */}
                <Card className="border-slate-200 shadow-sm">
                    {/* ... (Kode Header Card Pasien Tetap Sama) ... */}
                    <CardHeader className="border-b pb-4">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="text-xl text-slate-800">Database Pasien</CardTitle>
                                <CardDescription>Daftar seluruh pasien klinik Sehati Medika</CardDescription>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari nama atau alamat..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-slate-50 pl-9"
                                    />
                                </div>
                                <Button
                                    onClick={() => setIsPasienDialogOpen(true)}
                                    className="flex items-center gap-2 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Pasien Baru
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[400px] overflow-x-auto overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Nama / Email Pasien</th>
                                        <th className="px-6 py-4 text-center font-bold">L/P</th>
                                        <th className="px-6 py-4 text-center font-bold">Umur</th>
                                        <th className="px-6 py-4 font-bold">Alamat</th>
                                        <th className="px-6 py-4 text-right font-bold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPasiens.length > 0 ? (
                                        filteredPasiens.map((pasien) => (
                                            <tr key={pasien.id} className="transition-colors hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{pasien.nama}</div>
                                                            <div className="text-[11px] text-slate-500">{pasien.email || 'Tidak ada email'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-bold ${pasien.jenis_kelamin === 'Laki-laki' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}
                                                    >
                                                        {pasien.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium text-slate-700">{pasien.umur} Thn</td>
                                                <td className="max-w-[200px] truncate px-6 py-4 text-slate-600" title={pasien.alamat}>
                                                    {pasien.alamat}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {pasien.antrean_hari_ini ? (
                                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                            Sesi: {pasien.antrean_hari_ini}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={() => openAntreanDialog(pasien)}
                                                            size="sm"
                                                            className="bg-slate-800 text-white hover:bg-slate-900"
                                                        >
                                                            <ClipboardList className="mr-2 h-4 w-4" /> Booking Sesi
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                Tidak ada data pasien ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* ===== CARD TABEL ANTREAN HARI INI ===== */}
                <Card className="border-teal-100 shadow-sm">
                    <CardHeader className="border-b border-teal-50 bg-teal-50/30 pb-4">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl text-teal-900">
                                    <Activity className="text-teal-600" />
                                    Jadwal Sesi Pasien Hari Ini
                                </CardTitle>
                                <CardDescription className="text-teal-700/70">
                                    Menampilkan daftar pasien yang akan diperiksa pada{' '}
                                    <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                </CardDescription>
                            </div>

                            {/* [BARU] DROPDOWN FILTER DOKTER */}
                            <div className="w-full sm:w-64">
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Filter className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <Select value={filterDokterId} onValueChange={setFilterDokterId}>
                                        <SelectTrigger className="h-10 border-teal-200 bg-white pl-9 text-teal-900 focus:ring-teal-500">
                                            <SelectValue placeholder="Pilih Dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="semua" className="font-bold text-teal-700">
                                                Semua Dokter
                                            </SelectItem>
                                            {dokters.map((dokter) => (
                                                <SelectItem key={dokter.id} value={dokter.id.toString()}>
                                                    dr. {dokter.nama_dokter}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Jam Sesi</th>
                                        <th className="px-6 py-4 font-bold">Nama Pasien</th>
                                        <th className="px-6 py-4 font-bold">Poliklinik</th>
                                        <th className="px-6 py-4 font-bold">Dokter</th>
                                        <th className="px-6 py-4 text-center font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* [BARU] Gunakan array filteredAntreans, bukan antreans */}
                                    {filteredAntreans && filteredAntreans.length > 0 ? (
                                        filteredAntreans.map((antrean) => (
                                            <tr key={antrean.id} className="transition-colors hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-bold text-white">
                                                        <Clock size={12} />
                                                        {antrean.jam_kunjungan}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{antrean.nama_pasien}</td>
                                                <td className="px-6 py-4 text-slate-600">{antrean.poli}</td>
                                                <td className="px-6 py-4 text-slate-600">{antrean.nama_dokter}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                                            antrean.status === 'menunggu'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : antrean.status === 'diperiksa'
                                                                  ? 'bg-blue-100 text-blue-700'
                                                                  : 'bg-emerald-100 text-emerald-700'
                                                        }`}
                                                    >
                                                        {antrean.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                {filterDokterId === 'semua'
                                                    ? 'Belum ada pasien yang dijadwalkan untuk hari ini.'
                                                    : 'Dokter ini belum memiliki jadwal pasien hari ini.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* ===== DIALOG 1: TAMBAH PASIEN BARU ===== */}
                <Dialog open={isPasienDialogOpen} onOpenChange={setIsPasienDialogOpen}>
                    {/* ... KODE FORM PASIEN BARU (Tetap Sama Seperti Sebelumnya) ... */}
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                        <form onSubmit={submitPasien}>
                            <DialogHeader className="mb-4">
                                <DialogTitle>Pendaftaran Akun Pasien Baru</DialogTitle>
                                <DialogDescription>Buat akun login dan lengkapi profil medis pasien.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Section Akun Login */}
                                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                        1. Akun Login Pasien (Tabel Users)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-1.5 block text-xs">
                                                Email / Username <span className="text-rose-500">*</span>
                                            </Label>
                                            <Input
                                                type="email"
                                                value={formPasien.data.email}
                                                onChange={(e) => formPasien.setData('email', e.target.value)}
                                                placeholder="pasien@email.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1.5 block text-xs">
                                                Password <span className="text-rose-500">*</span>
                                            </Label>
                                            <Input
                                                type="password"
                                                value={formPasien.data.password}
                                                onChange={(e) => formPasien.setData('password', e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Data Profil */}
                                <div className="space-y-4">
                                    <h4 className="border-b pb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                        2. Data Diri Pasien (Tabel Pasiens)
                                    </h4>
                                    <div>
                                        <Label className="mb-1.5 block text-xs">
                                            Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            value={formPasien.data.nama}
                                            onChange={(e) => formPasien.setData('nama', e.target.value)}
                                            placeholder="Nama Lengkap"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-1.5 block text-xs">
                                                Jenis Kelamin <span className="text-rose-500">*</span>
                                            </Label>
                                            <Select
                                                value={formPasien.data.jenis_kelamin}
                                                onValueChange={(val) => formPasien.setData('jenis_kelamin', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-1.5 block text-xs">
                                                Umur (Tahun) <span className="text-rose-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={formPasien.data.umur}
                                                onChange={(e) => formPasien.setData('umur', e.target.value)}
                                                placeholder="Mis: 25"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 block text-xs">
                                            Alamat Lengkap <span className="text-rose-500">*</span>
                                        </Label>
                                        <textarea
                                            rows={3}
                                            value={formPasien.data.alamat}
                                            onChange={(e) => formPasien.setData('alamat', e.target.value)}
                                            className="w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                            placeholder="Alamat domisili saat ini..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => formPasien.reset()}>
                                    Reset Form
                                </Button>
                                <Button type="submit" disabled={formPasien.processing} className="bg-teal-600 text-white hover:bg-teal-700">
                                    {formPasien.processing ? 'Menyimpan...' : 'Simpan & Buat Akun'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* ===== DIALOG 2: MASUKKAN KE ANTREAN (Tetap Sama) ===== */}
                <Dialog open={isAntreanDialogOpen} onOpenChange={setIsAntreanDialogOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <form onSubmit={submitAntrean}>
                            <DialogHeader className="mb-4">
                                <DialogTitle>Booking Sesi Pemeriksaan</DialogTitle>
                                <DialogDescription>
                                    Atur jadwal periksa untuk pasien <span className="font-bold text-slate-800">{selectedPasien?.nama}</span>.
                                </DialogDescription>
                            </DialogHeader>

                            {/* ALERT ERROR DARI BACKEND */}
                            {(formAntrean.errors.jam_kunjungan || formAntrean.errors.tgl_kunjungan) && (
                                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                                    {formAntrean.errors.tgl_kunjungan && <p>{formAntrean.errors.tgl_kunjungan}</p>}
                                    {formAntrean.errors.jam_kunjungan && <p>{formAntrean.errors.jam_kunjungan}</p>}
                                </div>
                            )}

                            <div className="space-y-4 py-2">
                                <div>
                                    <Label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">Pilih Poliklinik</Label>
                                    <Select
                                        value={formAntrean.data.poli}
                                        onValueChange={(val) => {
                                            formAntrean.setData('poli', val);
                                            formAntrean.setData('dokter_id', '');
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="h-12 border-slate-200">
                                            <SelectValue placeholder="-- Pilih Poliklinik --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {daftarPoli.map((poli, index) => (
                                                <SelectItem key={index} value={poli}>
                                                    Poli {poli}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                        Pilih Dokter Bertugas
                                    </Label>
                                    <Select
                                        value={formAntrean.data.dokter_id}
                                        onValueChange={(val) => formAntrean.setData('dokter_id', val)}
                                        required
                                        disabled={!formAntrean.data.poli}
                                    >
                                        <SelectTrigger className="h-12 border-slate-200">
                                            <SelectValue
                                                placeholder={formAntrean.data.poli ? '-- Pilih Dokter --' : 'Pilih Poliklinik Terlebih Dahulu'}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dokters
                                                .filter((dokter) => dokter.keahlian === formAntrean.data.poli)
                                                .map((dokter) => (
                                                    <SelectItem key={dokter.id} value={dokter.id.toString()}>
                                                        {dokter.nama_dokter} (Poli {dokter.keahlian})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* INPUT TANGGAL & JAM */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            <CalendarDays size={14} /> Tanggal
                                        </Label>
                                        <Input
                                            type="date"
                                            value={formAntrean.data.tgl_kunjungan}
                                            onChange={(e) => formAntrean.setData('tgl_kunjungan', e.target.value)}
                                            required
                                            className="h-12"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                            <Clock size={14} /> Jam Sesi
                                        </Label>
                                        <Input
                                            type="time"
                                            value={formAntrean.data.jam_kunjungan}
                                            onChange={(e) => formAntrean.setData('jam_kunjungan', e.target.value)}
                                            required
                                            className="h-12"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500">*Pastikan jam sesi belum di-booking oleh orang lain.</p>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAntreanDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={formAntrean.processing} className="bg-slate-900 text-white hover:bg-slate-800">
                                    {formAntrean.processing ? 'Memproses...' : 'Simpan Booking'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
