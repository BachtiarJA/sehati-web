import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Stethoscope, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Interface disesuaikan dengan struktur tabel `dokter` dan relasi `users`
interface Dokter {
    id: number;
    user_id: number;
    nama_dokter: string;
    keahlian: string; // 'Umum' atau 'Khitan'
    no_str: string;
    no_telp: string;
    email?: string;
}

interface Props {
    dokters: Dokter[];
}

export default function DaftarDokter({ dokters = [] }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter pencarian
    const filteredDokters = dokters.filter(
        (dokter) =>
            dokter.nama_dokter.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dokter.keahlian.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dokter.no_str.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // ==========================================
    // FORM 1: TAMBAH DOKTER
    // ==========================================
    const { data, setData, post, processing, reset, errors } = useForm({
        nama_dokter: '',
        email: '',
        password: '',
        keahlian: 'Umum',
        no_str: '',
        no_telp: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/dokter', {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                alert('Data Dokter berhasil ditambahkan!');
            },
        });
    };

    // ==========================================
    // FORM 2: EDIT DOKTER
    // ==========================================
    const editForm = useForm({
        id: 0,
        nama_dokter: '',
        keahlian: '',
        no_str: '',
        no_telp: '',
    });

    const openEditDialog = (dokter: Dokter) => {
        editForm.setData({
            id: dokter.id,
            nama_dokter: dokter.nama_dokter,
            keahlian: dokter.keahlian,
            no_str: dokter.no_str,
            no_telp: dokter.no_telp,
        });
        setIsEditDialogOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirim request PUT ke /admin/dokter/{id}
        editForm.put(`/admin/dokter/${editForm.data.id}`, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
                alert('Data Dokter berhasil diperbarui!');
            },
        });
    };

    // ==========================================
    // FUNGSI 3: HAPUS DOKTER
    // ==========================================
    const deleteDokter = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data dokter ini? (Akun login dokter juga akan terhapus)')) {
            router.delete(`/admin/dokter/${id}`, {
                onSuccess: () => alert('Data Dokter berhasil dihapus!'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Dokter', href: '/admin/daftar-dokter' }]}>
            <Head title="Manajemen Dokter" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-teal-900">Manajemen Dokter</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Kelola profil, STR, dan akun login dokter klinik.</p>
                    </div>

                    {/* TOMBOL TAMBAH DOKTER */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-600 text-white shadow-sm hover:bg-teal-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Dokter Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Data Dokter</DialogTitle>
                                    <DialogDescription>Buat profil dokter beserta akun login sistemnya.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-5 py-4">
                                    {/* Data Login */}
                                    <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                                        <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Akun Login Sistem</h4>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right text-xs">
                                                Email
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="dokter@sehatimedika.com"
                                                    required
                                                />
                                                {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" className="text-right text-xs">
                                                Password
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Minimal 8 karakter"
                                                    required
                                                />
                                                {errors.password && <span className="text-xs text-rose-500">{errors.password}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Profil */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Profil Medis Dokter</h4>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_dokter" className="text-right text-xs">
                                                Nama Lengkap
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="nama_dokter"
                                                    value={data.nama_dokter}
                                                    onChange={(e) => setData('nama_dokter', e.target.value)}
                                                    placeholder="Mis: dr. Andi Saputra"
                                                    required
                                                />
                                                {errors.nama_dokter && <span className="text-xs text-rose-500">{errors.nama_dokter}</span>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="keahlian" className="text-right text-xs">
                                                Keahlian
                                            </Label>
                                            <div className="col-span-3">
                                                <Select value={data.keahlian} onValueChange={(val) => setData('keahlian', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Keahlian" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Umum">Umum</SelectItem>
                                                        <SelectItem value="Khitan">Khitan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="no_str" className="text-right text-xs">
                                                No. STR
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="no_str"
                                                    value={data.no_str}
                                                    onChange={(e) => setData('no_str', e.target.value)}
                                                    placeholder="Nomor Surat Tanda Registrasi"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="no_telp" className="text-right text-xs">
                                                No. Telp
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="no_telp"
                                                    value={data.no_telp}
                                                    onChange={(e) => setData('no_telp', e.target.value)}
                                                    placeholder="0812xxxx"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-teal-600 text-white hover:bg-teal-700">
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-slate-200 shadow-xs">
                    <CardHeader className="border-b pb-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-lg">Daftar Dokter</CardTitle>
                                <CardDescription>Data rekam dokter yang berpraktik di klinik.</CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama, keahlian..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-50 pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Nama Dokter</th>
                                        <th className="px-6 py-4 font-bold">Keahlian</th>
                                        <th className="px-6 py-4 font-bold">No. STR</th>
                                        <th className="px-6 py-4 font-bold">No. Telp</th>
                                        <th className="px-6 py-4 text-center font-bold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDokters.length > 0 ? (
                                        filteredDokters.map((dokter) => (
                                            <tr key={dokter.id} className="transition-colors hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-sm font-bold text-teal-700">
                                                            <Stethoscope size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{dokter.nama_dokter}</div>
                                                            <div className="text-[11px] text-slate-500">{dokter.email || 'Akun terhubung'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${dokter.keahlian === 'Khitan' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}
                                                    >
                                                        {dokter.keahlian}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-600">{dokter.no_str}</td>
                                                <td className="px-6 py-4 text-slate-600">{dokter.no_telp}</td>

                                                {/* ===================================== */}
                                                {/* KOLOM AKSI (EDIT & DELETE ICON) */}
                                                {/* ===================================== */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(dokter)}
                                                            className="h-8 w-8 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                                            title="Edit Dokter"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteDokter(dokter.id)}
                                                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                                            title="Hapus Dokter"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                Tidak ada data dokter ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* ========================================== */}
                {/* DIALOG FORM EDIT DOKTER */}
                {/* ========================================== */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={submitEdit}>
                            <DialogHeader>
                                <DialogTitle>Edit Data Dokter</DialogTitle>
                                <DialogDescription>Ubah profil dan informasi kontak dokter.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-5 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_nama" className="text-right text-xs">
                                        Nama Lengkap
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="edit_nama"
                                            value={editForm.data.nama_dokter}
                                            onChange={(e) => editForm.setData('nama_dokter', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-xs">Keahlian</Label>
                                    <div className="col-span-3">
                                        <Select value={editForm.data.keahlian} onValueChange={(val) => editForm.setData('keahlian', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Keahlian" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Umum">Umum</SelectItem>
                                                <SelectItem value="Khitan">Khitan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_str" className="text-right text-xs">
                                        No. STR
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="edit_str"
                                            value={editForm.data.no_str}
                                            onChange={(e) => editForm.setData('no_str', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_telp" className="text-right text-xs">
                                        No. Telp
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="edit_telp"
                                            value={editForm.data.no_telp}
                                            onChange={(e) => editForm.setData('no_telp', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={editForm.processing} className="bg-amber-500 text-white hover:bg-amber-600">
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Data'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
