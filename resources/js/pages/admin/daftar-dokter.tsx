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
import { Plus, Search, MoreHorizontal, UserCog } from 'lucide-react';

const staffData = [
    { id: 1, name: 'Dr. Andi Saputra', role: 'Dokter Umum', contact: '081234567890', status: 'Aktif' },
    { id: 2, name: 'Dr. Budi Santoso', role: 'Dokter Gigi', contact: '082345678901', status: 'Aktif' },
    { id: 3, name: 'Siti Aminah', role: 'Resepsionis', contact: '083456789012', status: 'Aktif' },
    { id: 4, name: 'Bambang Pamungkas', role: 'Admin IT', contact: '084567890123', status: 'Cuti' },
    { id: 5, name: 'Dr. Clara Shinta', role: 'Dokter Anak', contact: '085678901234', status: 'Aktif' },
];

export default function DaftarDokter() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Setup Inertia form (dummy endpoint for now)
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'dokter',
        specialization: '',
        phone: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted", data);
        setIsDialogOpen(false);
        reset();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manajemen Staff', href: '/admin/daftar-dokter' }]}>
            <Head title="Manajemen Staff" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-teal-900">Manajemen Staff & Dokter</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Kelola data dokter, resepsionis, dan admin klinik.</p>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Dokter / Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={submit}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Akun Baru</DialogTitle>
                                    <DialogDescription>
                                        Buat akun untuk dokter, admin, atau staff baru di klinik Sehati.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Nama</Label>
                                        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="col-span-3" placeholder="Nama Lengkap" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="col-span-3" placeholder="email@sehatimedika.com" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">Password</Label>
                                        <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">Peran</Label>
                                        <div className="col-span-3">
                                            <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Peran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dokter">Dokter</SelectItem>
                                                    <SelectItem value="admin">Admin / IT</SelectItem>
                                                    <SelectItem value="resepsionis">Resepsionis</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {data.role === 'dokter' && (
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="specialization" className="text-right">Spesialis</Label>
                                            <Input id="specialization" value={data.specialization} onChange={e => setData('specialization', e.target.value)} className="col-span-3" placeholder="Contoh: Dokter Umum" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">No. Telp</Label>
                                        <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} className="col-span-3" placeholder="0812xxx" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={processing} className="bg-teal-600 hover:bg-teal-700 text-white">Simpan Akun</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="shadow-xs border-slate-200">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-lg">Daftar Akun Sistem</CardTitle>
                                <CardDescription>Daftar seluruh staff yang memiliki akses ke sistem rekam medis.</CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Cari nama atau peran..." className="pl-8 bg-slate-50" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Nama / Email</th>
                                        <th className="px-6 py-4 font-medium">Peran</th>
                                        <th className="px-6 py-4 font-medium">Kontak</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {staffData.map((staff) => (
                                        <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-sm border border-teal-100">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{staff.name}</div>
                                                        <div className="text-xs text-slate-500">{staff.name.replace(/\s+/g, '').toLowerCase().replace('.', '')}@sehatimedika.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {staff.role.includes('Dokter') ? <UserCog className="h-4 w-4 text-teal-600" /> : <UserCog className="h-4 w-4 text-slate-400" />}
                                                    <span className="text-slate-700 font-medium">{staff.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{staff.contact}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={staff.status === 'Aktif' ? 'default' : 'secondary'} className={staff.status === 'Aktif' ? 'bg-teal-100 text-teal-700 hover:bg-teal-200 border-transparent shadow-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent shadow-none'}>
                                                    {staff.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
