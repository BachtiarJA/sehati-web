import { Head, useForm, Link } from '@inertiajs/react';
import { HeartPulse, Mail, Lock, User, Phone, ArrowLeft, ShieldCheck, Stethoscope, FileText } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

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
        <div className="min-h-screen flex bg-[#FAFAFC] selection:bg-teal-200 selection:text-teal-900 font-sans">
            <Head title="Register Dokter" />

            {/* Left Column: Image Presentation */}
            <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Background Ornaments */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-teal-900 z-10 opacity-90"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-20"></div>
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 z-20"></div>

                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50 z-0"
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Modern clinic registration"
                />

                {/* Floating Glass Component on top of Image */}
                <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-12">
                    <div className="w-full max-w-lg p-10 rounded-[32px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Mulai Perjalanan Medis Anda.</h2>
                        <p className="text-slate-300 font-medium text-lg leading-relaxed mb-8">
                            Bergabunglah bersama ribuan dokter spesialis lainnya. Kelola antrian, rekam medis, dan layanan klinik secara real-time dan terintegrasi.
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                "Manajemen pasien real-time",
                                "Dashboard analitik & laporan lengkap",
                                "Sistem notifikasi pintar & alarm IGD"
                            ].map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-200">
                                    <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 border border-teal-500/50">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="font-semibold text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 relative z-10 overflow-y-auto">
                <div className="w-full max-w-[480px] absolute top-8 right-8 lg:right-16 flex items-center justify-end gap-3 z-50">
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer text-slate-500 hover:text-teal-600 font-medium transition-colors">
                        <div className="group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft size={18} />
                        </div>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                <div className="w-full max-w-[480px] space-y-6 mt-12 lg:mt-0 pb-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <HeartPulse className="text-white w-7 h-7" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-900">Sehati Medika</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Buat Akun Dokter ✨</h1>
                        <p className="text-slate-500 font-medium tracking-wide">Lengkapi data profesional Anda untuk platform ini.</p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>

                        {/* Nama Lengkap */}
                        <div className="group relative">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap (beserta gelar)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    disabled={processing}
                                    className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                    placeholder="dr. Budi Santoso, Sp.A"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Keahlian & No STR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Spesialisasi</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors z-10">
                                        <Stethoscope size={20} />
                                    </div>
                                    <select
                                        value={data.keahlian}
                                        onChange={(e) => setData('keahlian', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Pilih spesialisasi...</option>
                                        <option value="Umum">Dokter Umum</option>
                                        <option value="Khitan">Layanan Khitan</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                <InputError message={errors.keahlian} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">No. STR</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.no_str}
                                        onChange={(e) => setData('no_str', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="No STR Aktif"
                                    />
                                </div>
                                <InputError message={errors.no_str} className="mt-1" />
                            </div>
                        </div>

                        {/* Email & No Telp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="mail@klinik.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">No. Telp / WA</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="0812345678"
                                    />
                                </div>
                                <InputError message={errors.no_telp} className="mt-1" />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
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
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_8px_20px_rgb(15,118,110,0.25)] text-lg font-bold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Daftar sebagai Dokter'}
                            </button>
                        </div>

                        <p className="text-center text-sm font-medium text-slate-500 mt-2">
                            Dengan mendaftar, Anda menyetujui{' '}
                            <a href="#" className="font-bold text-teal-600 hover:text-teal-500">Syarat Ketentuan</a> dan{' '}
                            <a href="#" className="font-bold text-teal-600 hover:text-teal-500">Kebijakan Privasi</a> kami.
                        </p>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">Atau</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <p className="text-center text-base font-semibold text-slate-600">
                            Sudah memiliki akun?{' '}
                            <Link href="/login" className="font-extrabold text-orange-500 hover:text-orange-600 transition-colors">Masuk di sini</Link>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    );
}
