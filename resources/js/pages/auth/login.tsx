import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
      email: '',
      password: '',
      remember: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
        onFinish: () => reset('password'),
    });
  };

  return (
    <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        `}</style>
        <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen relative flex items-center justify-center bg-slate-900 selection:bg-[#04989F]/30 selection:text-[#04989F] font-sans py-12 px-4 sm:px-6 overflow-x-hidden overflow-y-auto">
            <Head title="Login" />
            
            {/* Background Ornaments */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#04989F]/80 to-slate-900 z-10 opacity-90"></div>
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#04989F]/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 z-20"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#D66604]/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 z-20"></div>

            <img
                className="fixed inset-0 h-full w-full object-cover mix-blend-overlay opacity-60 z-0"
                src="https://images.unsplash.com/photo-1551076805-e18690c5e530?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Healthcare professionals"
            />

            {/* Form Section */}
            <div className="relative z-30 w-full max-w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 sm:p-6 border border-slate-100">
                <div className="absolute top-6 right-8 flex items-center justify-end z-50">
                    <Link href="/" className="flex items-center gap-1.5 group cursor-pointer text-slate-400 hover:text-[#04989F] transition-colors text-xs font-bold uppercase tracking-wider">
                        <div className="group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft size={14} />
                        </div>
                        <span>Kembali</span>
                    </Link>
                </div>

                <div className="w-full space-y-3">
                    <div className="text-center sm:text-left mt-1">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <img src="/logo.png" alt="Sehati Medika" className="h-6 w-auto object-contain" />
                            <span className="font-extrabold text-base tracking-tight text-slate-900">Sehati Medika</span>
                        </div>
                        <h1 className="text-lg font-extrabold text-slate-900 mb-0.5 tracking-tight">Selamat Datang Kembali! 👋</h1>
                        <p className="text-slate-500 text-xs font-medium tracking-wide">Masuk untuk melanjutkan ke dashboard.</p>
                    </div>

                    <form className="space-y-2.5" onSubmit={handleLogin}>
                        <div className="group relative">
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors z-10">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="group relative">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-slate-700">Password</label>
                                <a href="#" className="font-bold text-[11px] text-[#04989F] hover:text-[#037d83] transition-colors">Lupa Password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors z-10">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    className="block w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none z-10"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-xl shadow-lg shadow-[#04989F]/30 text-[13px] font-bold text-white bg-[#04989F] hover:bg-[#037d83] transform hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Masuk Sekarang'}
                            </button>
                        </div>

                        <div className="relative py-3 flex items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider">Atau masuk dengan</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* <div className="grid grid-cols-1">
                            <button type="button" className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-colors shadow-sm text-slate-700 text-[11px] font-bold">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                                Google
                            </button>
                        </div> */}

                        <p className="text-center text-xs font-semibold text-slate-600 mt-3">
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-bold text-[#D66604] hover:text-[#b55503] transition-colors">Daftar sekarang</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </>
  );
}

export default Login;
