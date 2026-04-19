import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    // Tambahan atribut dokter
    keahlian: string;
    no_str: string;
    no_telp: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        keahlian: '',
        no_str: '',
        no_telp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Registrasi Dokter" description="Masukkan detail Anda untuk membuat akun dokter">
            <Head title="Register Dokter" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap (beserta Gelar)</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="dr. Budi Santoso, Sp.A"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@klinik.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* --- INPUT BARU: KEAHLIAN --- */}
                    <div className="grid gap-2">
                        <Label htmlFor="keahlian">Spesialisasi / Layanan Klinik</Label>

                        <select
                            id="keahlian"
                            required
                            tabIndex={3}
                            value={data.keahlian}
                            onChange={(e) => setData('keahlian', e.target.value)}
                            disabled={processing}
                            // Styling ini menyesuaikan tampilan <Input> bawaan shadcn
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {/* Pilihan pertama (kosong) sebagai placeholder wajib isi */}
                            <option value="" disabled>
                                Pilih layanan...
                            </option>
                            <option value="Umum">Dokter Umum</option>
                            <option value="Khitan">Layanan Khitan</option>
                        </select>

                        <InputError message={errors.keahlian} />
                    </div>

                    {/* --- INPUT BARU: NO STR --- */}
                    <div className="grid gap-2">
                        <Label htmlFor="no_str">Nomor STR (Surat Tanda Registrasi)</Label>
                        <Input
                            id="no_str"
                            type="text"
                            required
                            tabIndex={4}
                            value={data.no_str}
                            onChange={(e) => setData('no_str', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan No. STR aktif"
                        />
                        <InputError message={errors.no_str} />
                    </div>

                    {/* --- INPUT BARU: NO TELP --- */}
                    <div className="grid gap-2">
                        <Label htmlFor="no_telp">Nomor Telepon</Label>
                        <Input
                            id="no_telp"
                            type="text"
                            required
                            tabIndex={5}
                            value={data.no_telp}
                            onChange={(e) => setData('no_telp', e.target.value)}
                            disabled={processing}
                            placeholder="08123456789"
                        />
                        <InputError message={errors.no_telp} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={6}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={7}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={8} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Daftar sebagai Dokter
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} tabIndex={9}>
                        Login di sini
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
