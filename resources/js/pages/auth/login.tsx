import { HeartPulse, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function Login() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.visit('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFC] selection:bg-teal-200 selection:text-teal-900">

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
              <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-900">Sehati Medika</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Selamat Datang Kembali! 👋</h1>
            <p className="text-slate-500 font-medium">Masuk untuk melanjutkan ke dashboard pasien Anda.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div className="group relative">
                <Label className="block text-sm font-bold text-slate-700 mb-2">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 z-10 transition-colors">
                    <Mail size={20} />
                  </div>
                  <Input
                    type="email"
                    className="block w-full pl-11 pr-4 h-13 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="group relative">
                <div className="flex items-center justify-between mb-2">
                  <Label className="block text-sm font-bold text-slate-700">Password</Label>
                  <a href="#" className="font-bold text-sm text-teal-600 hover:text-teal-500 transition-colors">Lupa Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 z-10 transition-colors">
                    <Lock size={20} />
                  </div>
                  <Input
                    type="password"
                    className="block w-full pl-11 pr-4 h-13 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full flex justify-center items-center gap-2 py-6 border border-transparent rounded-xl shadow-[0_8px_20px_rgb(15,118,110,0.25)] text-lg font-bold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transform hover:-translate-y-0.5 transition-all outline-none">
              Masuk Sekarang
            </Button>

            <div className="relative py-4 flex items-center">
               <div className="flex-grow border-t border-slate-200"></div>
               <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">Atau masuk dengan</span>
               <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex justify-center items-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-700 font-bold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  Google
               </button>
               <button type="button" className="flex justify-center items-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-700 font-bold">
                  <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.933 17.7 3.933 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  GitHub
               </button>
            </div>

            <p className="text-center text-sm font-medium text-slate-600 mt-8">
              Belum punya akun?{' '}
              <Link href="/register" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">Daftar sekarang</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Column: Image Presentation */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
         {/* Background Ornaments */}
         <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 z-10 opacity-90"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 z-20"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 z-20"></div>

         <img
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60 z-0"
            src="https://images.unsplash.com/photo-1551076805-e18690c5e530?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="Healthcare professionals"
         />

         {/* Floating Glass Component on top of Image */}
         <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-12">
            <div className="glass-panel w-full max-w-lg p-10 rounded-[32px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
                  <ShieldCheck size={32} />
               </div>
               <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Akses Rekam Medis Anda Dalam Sekejap.</h2>
               <p className="text-slate-300 font-medium text-lg leading-relaxed mb-8">
                  Pantau kesehatan Anda dan keluarga, jadwalkan temu dokter, dan pesan obat langsung ke pintu Anda melalui dashboard personal Sehati Medika.
               </p>

               <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                     <img className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="User" />
                     <img className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" />
                     <img className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Bergabung dengan 10.000+ Pasien Aktif</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

export default Login;
