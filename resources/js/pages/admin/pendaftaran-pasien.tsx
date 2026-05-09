import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, ClipboardList, Search, User, UserPlus } from 'lucide-react';
import { useState } from 'react';

// Interfaces disesuaikan dengan Database
interface Pasien {
    id: number;
    user_id: number;
    nama: string;
    jenis_kelamin: string;
    umur: number;
    alamat: string;
    email?: string;
    antrean_hari_ini?: string | null; // <--- TAMBAHAN BARU
}

interface Dokter {
    id: number;
    nama_dokter: string;
    keahlian: string;
}

interface Props {
    pasiens?: Pasien[];
    dokters?: Dokter[];
}

export default function PendaftaranPasien({ pasiens = [], dokters = [] }: Props) {
    const [isPasienDialogOpen, setIsPasienDialogOpen] = useState(false);
    const [isAntreanDialogOpen, setIsAntreanDialogOpen] = useState(false);
    const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter pencarian pasien
    const filteredPasiens = pasiens.filter(
        (p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Form 1: Pembuatan Akun & Profil Pasien Baru
    const formPasien = useForm({
        nama: '',
        email: '',
        password: '',
        jenis_kelamin: '',
        umur: '',
        alamat: '',
    });

    // Form 2: Pendaftaran Antrean
    const formAntrean = useForm({
        pasien_id: '',
        poli: '',
        dokter_id: '',
    });

    // Handle Submit Pasien Baru
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

    // Handle Buka Dialog Antrean
    const openAntreanDialog = (pasien: Pasien) => {
        setSelectedPasien(pasien);
        formAntrean.setData('pasien_id', pasien.id.toString());
        setIsAntreanDialogOpen(true);
    };

    // Handle Submit Antrean
    const submitAntrean = (e: React.FormEvent) => {
        e.preventDefault();
        formAntrean.post('/admin/pendaftaran/antrian', {
            onSuccess: () => {
                setIsAntreanDialogOpen(false);
                formAntrean.reset();
                setSelectedPasien(null);
                alert('Pasien berhasil dimasukkan ke antrean!');
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
                        <h1 className="mb-2 text-3xl font-extrabold text-teal-800">Pendaftaran & Antrean Pasien</h1>
                        <p className="text-sm font-medium text-slate-500">
                            Cari pasien yang sudah terdaftar untuk dimasukkan ke antrean, atau buat akun pasien baru jika belum pernah berobat.
                        </p>
                    </div>
                </div>

                {/* ===== CARD TABEL PASIEN ===== */}
                <Card className="border-slate-200 shadow-sm">
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
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
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
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

                                                {/* KONDISI PERUBAHAN TOMBOL ADA DI SINI */}
                                                <td className="px-6 py-4 text-right">
                                                    {pasien.antrean_hari_ini ? (
                                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                            Antrean: {pasien.antrean_hari_ini}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={() => openAntreanDialog(pasien)}
                                                            size="sm"
                                                            className="bg-slate-800 text-white hover:bg-slate-900"
                                                        >
                                                            <ClipboardList className="mr-2 h-4 w-4" /> Masukkan Antrean
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

                {/* ===== DIALOG 1: TAMBAH PASIEN BARU ===== */}
                <Dialog open={isPasienDialogOpen} onOpenChange={setIsPasienDialogOpen}>
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

                {/* ===== DIALOG 2: MASUKKAN KE ANTREAN ===== */}
                <Dialog open={isAntreanDialogOpen} onOpenChange={setIsAntreanDialogOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <form onSubmit={submitAntrean}>
                            <DialogHeader className="mb-4">
                                <DialogTitle>Pendaftaran Antrean Poli</DialogTitle>
                                <DialogDescription>
                                    Masukkan pasien <span className="font-bold text-slate-800">{selectedPasien?.nama}</span> ke dalam daftar tunggu
                                    pemeriksaan.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                <div>
                                    <Label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase">Pilih Poliklinik</Label>
                                    <Select
                                        value={formAntrean.data.poli}
                                        onValueChange={(val) => {
                                            formAntrean.setData('poli', val);
                                            formAntrean.setData('dokter_id', ''); // <--- RESET pilihan dokter setiap ganti poli
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="h-12 border-slate-200">
                                            <SelectValue placeholder="-- Pilih Poliklinik --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                                            <SelectItem value="Poli Khitan">Poli Khitan</SelectItem>
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
                                        disabled={!formAntrean.data.poli} // <--- Disable dropdown dokter jika poli belum dipilih
                                    >
                                        <SelectTrigger className="h-12 border-slate-200">
                                            <SelectValue
                                                placeholder={formAntrean.data.poli ? '-- Pilih Dokter --' : 'Pilih Poliklinik Terlebih Dahulu'}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dokters
                                                // FILTER DOKTER DI SINI:
                                                // Cocokkan string (misal: "Poli Khitan" ada kata "Khitan" dari dokter.keahlian)
                                                .filter((dokter) => formAntrean.data.poli.includes(dokter.keahlian))
                                                .map((dokter) => (
                                                    <SelectItem key={dokter.id} value={dokter.id.toString()}>
                                                        {dokter.nama_dokter} ({dokter.keahlian})
                                                    </SelectItem>
                                                ))}

                                            {/* Tampilkan pesan jika tidak ada dokter untuk poli yang dipilih */}
                                            {dokters.filter((dokter) => formAntrean.data.poli.includes(dokter.keahlian)).length === 0 && (
                                                <SelectItem value="0" disabled>
                                                    {formAntrean.data.poli ? 'Tidak ada dokter untuk Poli ini' : 'Pilih Poliklinik dulu'}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAntreanDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={formAntrean.processing} className="bg-slate-900 text-white hover:bg-slate-800">
                                    {formAntrean.processing ? 'Memproses...' : 'Cetak Nomor Antrean'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
