import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, HeartPulse, Lock, Mail, Phone, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    const { data, setData, post, processing, errors, reset } = useForm({
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
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] font-sans selection:bg-teal-200 selection:text-teal-900">
            <Head title="Register Dokter" />

            {/* Left Column: Image Presentation */}
            <div className="relative hidden overflow-hidden bg-slate-900 lg:block lg:w-1/2">
                {/* Background Ornaments */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900 to-teal-900 opacity-90"></div>
                <div className="absolute right-0 bottom-0 z-20 h-[800px] w-[800px] translate-x-1/3 translate-y-1/3 rounded-full bg-teal-500/20 blur-[120px]"></div>
                <div className="absolute top-0 left-0 z-20 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-500/20 blur-[100px]"></div>

                <img
                    className="absolute inset-0 z-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Modern clinic registration"
                />

                {/* Floating Glass Component on top of Image */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-12">
                    <div className="w-full max-w-lg rounded-[32px] border border-white/20 bg-white/10 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="mb-4 text-3xl leading-tight font-extrabold text-white">Mulai Perjalanan Medis Anda.</h2>
                        <p className="mb-8 text-lg leading-relaxed font-medium text-slate-300">
                            Bergabunglah bersama ribuan dokter spesialis lainnya. Kelola antrian, rekam medis, dan layanan klinik secara real-time dan
                            terintegrasi.
                        </p>

                        <div className="flex flex-col gap-4">
                            {['Manajemen pasien real-time', 'Dashboard analitik & laporan lengkap', 'Sistem notifikasi pintar & alarm IGD'].map(
                                (benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-200">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-teal-500/50 bg-teal-500/30 text-teal-400">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold">{benefit}</span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Section */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center overflow-y-auto px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
                <div className="absolute top-8 right-8 z-50 flex w-full max-w-[480px] items-center justify-end gap-3 lg:right-16">
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center gap-2 font-medium text-slate-500 transition-colors hover:text-teal-600"
                    >
                        <div className="transition-transform group-hover:-translate-x-1">
                            <ArrowLeft size={18} />
                        </div>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                <div className="mt-12 w-full max-w-[480px] space-y-6 pb-8 lg:mt-0">
                    <div className="text-center lg:text-left">
                        <div className="mb-6 inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/20">
                                <HeartPulse className="h-7 w-7 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                                Sehati Medika
                            </span>
                        </div>
                        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">Buat Akun Dokter ✨</h1>
                        <p className="font-medium tracking-wide text-slate-500">Lengkapi data profesional Anda untuk platform ini.</p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        {/* Nama Lengkap */}
                        <div className="group relative">
                            <label className="mb-2 block text-sm font-bold text-slate-700">Nama Lengkap (beserta gelar)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                    <User size={20} />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    disabled={processing}
                                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                    placeholder="dr. Budi Santoso, Sp.A"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Keahlian & No STR */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Spesialisasi</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <Stethoscope size={20} />
                                    </div>
                                    <select
                                        name="keahlian"
                                        value={data.keahlian}
                                        onChange={(e) => setData('keahlian', e.target.value)}
                                        required
                                        tabIndex={2}
                                        disabled={processing}
                                        className="block w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-11 font-medium text-slate-800 transition-all outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        <option value="" disabled>
                                            Pilih spesialisasi...
                                        </option>
                                        <option value="Umum">Dokter Umum</option>
                                        <option value="Khitan">Layanan Khitan</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <InputError message={errors.keahlian} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">No. STR</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <FileText size={20} />
                                    </div>
                                    <input
                                        name="no_str"
                                        type="text"
                                        value={data.no_str}
                                        onChange={(e) => setData('no_str', e.target.value)}
                                        required
                                        tabIndex={3}
                                        autoComplete="off"
                                        disabled={processing}
                                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="No STR Aktif"
                                    />
                                </div>
                                <InputError message={errors.no_str} className="mt-1" />
                            </div>
                        </div>

                        {/* Email & No Telp */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        tabIndex={4}
                                        autoComplete="email"
                                        disabled={processing}
                                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="mail@klinik.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">No. Telp / WA</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <Phone size={20} />
                                    </div>
                                    <input
                                        name="no_telp"
                                        type="tel"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                        required
                                        tabIndex={5}
                                        autoComplete="tel"
                                        disabled={processing}
                                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="0812345678"
                                    />
                                </div>
                                <InputError message={errors.no_telp} className="mt-1" />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        tabIndex={6}
                                        autoComplete="new-password"
                                        disabled={processing}
                                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="mb-2 block text-sm font-bold text-slate-700">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-teal-500">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        name="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        tabIndex={7}
                                        autoComplete="new-password"
                                        disabled={processing}
                                        className="block w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full transform items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-4 text-lg font-bold text-white shadow-[0_8px_20px_rgb(15,118,110,0.25)] transition-all outline-none hover:-translate-y-0.5 hover:from-teal-500 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? (
                                    <svg
                                        className="h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    'Daftar sebagai Dokter'
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-center text-sm font-medium text-slate-500">
                            Dengan mendaftar, Anda menyetujui{' '}
                            <a href="#" className="font-bold text-teal-600 hover:text-teal-500">
                                Syarat Ketentuan
                            </a>{' '}
                            dan{' '}
                            <a href="#" className="font-bold text-teal-600 hover:text-teal-500">
                                Kebijakan Privasi
                            </a>{' '}
                            kami.
                        </p>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="mx-4 flex-shrink-0 text-sm font-bold tracking-wider text-slate-400 uppercase">Atau</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <p className="text-center text-base font-semibold text-slate-600">
                            Sudah memiliki akun?{' '}
                            <Link href="/login" className="font-extrabold text-orange-500 transition-colors hover:text-orange-600">
                                Masuk di sini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
