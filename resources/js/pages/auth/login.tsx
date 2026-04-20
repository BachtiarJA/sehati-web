import { Head, useForm, Link } from '@inertiajs/react';
import { HeartPulse, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex bg-[#FAFAFC] selection:bg-teal-200 selection:text-teal-900">

            <Head title="Login" />

            {/* Left Column: Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 relative z-10">

                <div className="w-full max-w-md absolute top-8 left-8 lg:left-16 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer text-slate-500 hover:text-teal-600 font-medium transition-colors">
                        <div className="rotate-180 group-hover:-translate-x-1 transition-transform">
                            <ArrowRight size={18} />
                        </div>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-10">

                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <HeartPulse className="text-white w-7 h-7" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-900">
                                Sehati Medika
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            Selamat Datang Kembali! 👋
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Masuk untuk melanjutkan ke dashboard pasien Anda.
                        </p>
                    </div>

                    {/* STATUS MESSAGE */}
                    {status && (
                        <div className="text-green-600 text-sm font-medium text-center">
                            {status}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={submit}>
                        <div className="space-y-5">

                            {/* EMAIL */}
                            <div className="group relative">
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 z-10 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 h-13 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* PASSWORD */}
                            <div className="group relative">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-slate-700">
                                        Password
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="font-bold text-sm text-teal-600 hover:text-teal-500 transition-colors"
                                            tabIndex={5}
                                        >
                                            Lupa Password?
                                        </Link>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 z-10 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        disabled={processing}
                                        className="block w-full pl-11 pr-4 h-13 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* REMEMBER ME */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4"
                                    tabIndex={3}
                                />
                                <span className="text-sm text-slate-600">Remember me</span>
                            </div>

                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center items-center gap-2 py-6 border border-transparent rounded-xl shadow-[0_8px_20px_rgb(15,118,110,0.25)] text-lg font-bold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing && (
                                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            Masuk Sekarang
                        </button>

                        {/* REGISTER */}
                        <p className="text-center text-sm font-medium text-slate-600 mt-8">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
                                Daftar sekarang
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Column tetap sama (tidak diubah) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 z-10 opacity-90"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 z-20"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 z-20"></div>

                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60 z-0"
                    src="https://images.unsplash.com/photo-1551076805-e18690c5e530"
                    alt="Healthcare professionals"
                />

                <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-12">
                    <div className="w-full max-w-lg p-10 rounded-[32px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                            Akses Rekam Medis Anda Dalam Sekejap.
                        </h2>
                        <p className="text-slate-300 font-medium text-lg leading-relaxed">
                            Pantau kesehatan Anda dan keluarga dengan mudah.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
