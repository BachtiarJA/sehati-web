import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, MoreHorizontal, User, Clock, ArrowRight } from 'lucide-react';

const pasienData = [
    { id: 1, rm: 'RM-00102', name: 'Budi Darmawan', umur: 45, contact: '081234567890', status: 'Dalam Antrean', poliklinik: 'Poli Umum' },
    { id: 2, rm: 'RM-00103', name: 'Siti Rahmawati', umur: 32, contact: '082345678901', status: 'Selesai', poliklinik: 'Poli Gigi' },
    { id: 3, rm: 'RM-00104', name: 'Ahmad Fauzi', umur: 28, contact: '083456789012', status: 'Dalam Antrean', poliklinik: 'Poli Umum' },
    { id: 4, rm: 'RM-00105', name: 'Nina Kartika', umur: 8, contact: '084567890123', status: 'Pemeriksaan', poliklinik: 'Poli Anak' },
    { id: 5, rm: 'RM-00106', name: 'Rudi Hartono', umur: 55, contact: '085678901234', status: 'Terdaftar', poliklinik: '-' },
];

export default function PendaftaranPasien() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAntreanDialogOpen, setIsAntreanDialogOpen] = useState(false);
    const [selectedPasien, setSelectedPasien] = useState<any>(null);

    const { data: pasienDataForm, setData: setPasienDataForm, reset: resetPasien } = useForm({
        nik: '',
        name: '',
        tanggalLahir: '',
        noHp: '',
    });

    const { data: antreanData, setData: setAntreanData, reset: resetAntrean } = useForm({
        poliklinik: '',
        dokter: '',
    });

    const submitPasien = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Pasien baru disubmit", pasienDataForm);
        setIsDialogOpen(false);
        resetPasien();
    };

    const submitAntrean = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dimasukkan ke antrean", selectedPasien, antreanData);
        setIsAntreanDialogOpen(false);
        resetAntrean();
        setSelectedPasien(null);
    };

    const openAntreanDialog = (pasien: any) => {
        setSelectedPasien(pasien);
        setIsAntreanDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Admin', href: '/admin/pendaftaran-pasien' }]}>
            <Head title="Manajemen Pasien" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">

                {/* ===== TAMBAHAN DARI DASHBOARD AWAL ===== */}
                <div className="rounded-2xl border border-teal-100 bg-white p-10 text-center shadow-sm">
                    <div className="mb-4 text-6xl">🚀</div>
                    <h1 className="mb-2 text-3xl font-extrabold text-teal-700">Manajemen Pasien</h1>
                    <p className="text-lg font-medium text-slate-500">
                        Kelola data pasien dan tambahkan ke dalam antrean pemeriksaan.
                    </p>
                </div>

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-teal-900">Manajemen Pasien & Antrean</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Kelola data pasien, pendaftaran baru, dan antrean poliklinik.
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pasien Baru
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={submitPasien}>
                                <DialogHeader>
                                    <DialogTitle>Pendaftaran Pasien Baru</DialogTitle>
                                    <DialogDescription>
                                        Daftarkan pasien yang belum memiliki rekam medis di klinik.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <Input placeholder="NIK" value={pasienDataForm.nik} onChange={e => setPasienDataForm('nik', e.target.value)} />
                                    <Input placeholder="Nama" value={pasienDataForm.name} onChange={e => setPasienDataForm('name', e.target.value)} />
                                    <Input type="date" value={pasienDataForm.tanggalLahir} onChange={e => setPasienDataForm('tanggalLahir', e.target.value)} />
                                    <Input placeholder="No HP" value={pasienDataForm.noHp} onChange={e => setPasienDataForm('noHp', e.target.value)} />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                    <Button type="submit" className="bg-teal-600 text-white">Daftarkan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ===== TABLE PASIEN ===== */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pasien</CardTitle>
                        <CardDescription>Cari dan masukkan ke antrean</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {pasienData.map((pasien) => (
                            <div key={pasien.id} className="flex justify-between border-b py-3">
                                <div>
                                    <p className="font-semibold">{pasien.name}</p>
                                    <p className="text-sm text-slate-500">{pasien.rm}</p>
                                </div>

                                <Button onClick={() => openAntreanDialog(pasien)}>
                                    Antrean
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* ===== DIALOG ANTREAN ===== */}
                <Dialog open={isAntreanDialogOpen} onOpenChange={setIsAntreanDialogOpen}>
                    <DialogContent>
                        <form onSubmit={submitAntrean}>
                            <DialogHeader>
                                <DialogTitle>Masukkan Antrean</DialogTitle>
                            </DialogHeader>

                            <Select onValueChange={(val) => setAntreanData('poliklinik', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Poli" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                                    <SelectItem value="Poli Gigi">Poli Gigi</SelectItem>
                                </SelectContent>
                            </Select>

                            <DialogFooter>
                                <Button type="submit">Simpan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}