import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, User, Phone, ArrowLeft, ShieldCheck, Stethoscope, FileText, Briefcase, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Dokter',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            `}</style>
            <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen relative flex items-center justify-center bg-slate-900 selection:bg-[#04989F]/30 selection:text-[#04989F] font-sans py-12 px-4 sm:px-6 overflow-x-hidden overflow-y-auto">
                <Head title="Register Akun" />
                
                {/* Background Ornaments */}
                <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-[#04989F]/80 z-10 opacity-90"></div>
                <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-[#04989F]/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-20"></div>
                <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#D66604]/20 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 z-20"></div>

                <img
                    className="fixed inset-0 h-full w-full object-cover mix-blend-overlay opacity-50 z-0"
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Modern clinic registration"
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
                            <h1 className="text-lg font-extrabold text-slate-900 mb-0.5 tracking-tight">Buat Akun Baru ✨</h1>
                            <p className="text-slate-500 text-xs font-medium tracking-wide">Pilih peran Anda dan lengkapi data pendaftaran.</p>
                        </div>

                        <form className="space-y-2.5" onSubmit={submit}>
                            
                            {/* Nama Lengkap */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors">
                                        <User size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none" 
                                        placeholder="Nama lengkap"
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-1 text-xs" />
                            </div>

                            {/* Peran / Role */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Peran</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors z-10">
                                        <Briefcase size={16} />
                                    </div>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Dokter">Dokter</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none" 
                                        placeholder="mail@klinik.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            {/* Passwords */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none" 
                                        placeholder="Minimal 8 karakter"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            <div className="group relative">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#04989F] transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        disabled={processing}
                                        className="block w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] focus:bg-white transition-all text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none" 
                                        placeholder="Ulangi password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
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
                                    ) : 'Daftar Sekarang'}
                                </button>
                            </div>
                            
                            <p className="text-center text-xs font-medium text-slate-500 mt-2">
                                Dengan mendaftar, Anda menyetujui{' '}
                                <a href="#" className="font-bold text-[#04989F] hover:text-[#037d83]">Syarat Ketentuan</a> dan{' '}
                                <a href="#" className="font-bold text-[#04989F] hover:text-[#037d83]">Kebijakan Privasi</a>.
                            </p>

                            <div className="relative py-2.5 flex items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Atau</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>
                            
                            <p className="text-center text-xs font-semibold text-slate-600">
                                Sudah memiliki akun?{' '}
                                <Link href="/login" className="font-extrabold text-[#D66604] hover:text-[#b55503] transition-colors">Masuk di sini</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
