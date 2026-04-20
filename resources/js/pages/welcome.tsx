import {
  HeartPulse,
  Stethoscope,
  Clock,
  ShieldCheck,
  UserCheck,
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

function Home() {
  return (
    <div className="font-sans text-slate-800 bg-[#FAFAFC] flex flex-col min-h-screen overflow-x-hidden selection:bg-teal-200 selection:text-teal-900">

      {/* Decorative Top Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply"></div>
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-900">Sehati Medika</span>
            </div>
            <div className="hidden md:flex space-x-10 items-center">
              {['Beranda', 'Layanan', 'Fitur'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full rounded-full"></span>
                </a>
              ))}
              <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative group">
                Tentang Kami
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full rounded-full"></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 animate-slide-up">
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">Masuk</Link>
              <Link href="/register" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-7 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 border border-teal-400/20 inline-block">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="pt-24 pb-32 relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            <div className="w-full lg:w-[55%] space-y-8 text-center lg:text-left z-20">

              <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-50 text-teal-700 font-bold text-sm shadow-sm backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                Pelayanan 24/7 Tersedia
              </div>

              <h1 className="animate-slide-up animation-delay-200 text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Layanan Kesehatan <br />
                <span className="text-gradient from-teal-500 via-teal-600 to-teal-800">Masa Depan</span>
              </h1>

              <p className="animate-slide-up animation-delay-400 text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Sehati Medika menghadirkan pengalaman medis premium. Terintegrasi, cepat, dan profesional demi hidup Anda yang lebih bahagia.
              </p>

              <div className="animate-slide-up animation-delay-400 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 h-14 rounded-full font-bold text-lg transition-all shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-3">
                  <span className="relative z-10 flex items-center gap-2">Konsultasi Sekarang <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></span>
                </Button>
                <Button variant="outline" size="lg" className="glass-card hover:bg-white border text-slate-700 px-8 h-14 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3">
                  <Phone size={22} className="text-teal-600" /> Hubungi Darurat
                </Button>
              </div>

              <div className="animate-slide-up animation-delay-400 pt-8 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-3">
                  <img className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="User" />
                  <img className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" />
                  <img className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" />
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-sm text-sm font-bold text-slate-600">+2k</div>
                </div>
                <div className="text-sm font-medium text-slate-600 leading-tight">
                  Dipercaya oleh<br/><span className="text-slate-900 font-extrabold text-base">Ribuan Pasien</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[45%] relative mt-12 lg:mt-0 animate-float-delayed flex justify-center">

              <div className="relative w-full max-w-[500px] aspect-[4/5]">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-teal-200 rounded-[60px] rotate-[10deg] opacity-60 blur-lg mix-blend-multiply border-white/20"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 to-orange-200 rounded-[60px] -rotate-6 opacity-60 blur-lg mix-blend-multiply"></div>

                <div className="absolute inset-0 rounded-[48px] overflow-hidden border-[6px] border-white/80 shadow-2xl glass z-10 bg-white/30 backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium Healthcare Illustration"
                    className="w-full h-full object-cover mix-blend-overlay opacity-90"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Healthcare Doctor"
                    className="absolute inset-0 w-full h-full object-cover z-20"
                  />
                </div>

                <div className="absolute -bottom-6 -left-10 glass-panel p-5 rounded-3xl shadow-2xl z-30 flex items-center gap-5 animate-float border border-white">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 shadow-inner flex items-center justify-center text-white">
                    <UserCheck size={30} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-slate-800">4.9/5</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Pasien</p>
                  </div>
                </div>

                <div className="absolute top-12 -right-8 glass-panel p-4 rounded-2xl shadow-xl z-30 flex items-center gap-4 animate-float animation-delay-200 border border-white">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">Terlisensi</p>
                    <p className="text-xs text-slate-500">Kemenkes RI</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa Harus Sehati Medika */}
      <section id="layanan" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Keunggulan 🌟</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Kualitas Premium <br/>Sebagai <span className="text-gradient from-orange-400 to-orange-600">Standar Kami</span></h2>
            <p className="text-slate-600 text-lg font-medium">Bukan sekadar klinik biasa, kami menggabungkan hospitalitas tingkat VIP dengan teknologi medis terkini untuk Anda.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <div className="grid gap-6">
              {[
                { icon: Stethoscope, title: "Spesialis Berdedikasi", desc: "Ditangani oleh dokter spesialis board-certified dari lulusan terbaik.", color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20", iconColor: "text-blue-600", bgIcon: "bg-blue-50" },
                { icon: ShieldCheck, title: "Sterilisasi Tingkat Tinggi", desc: "Protokol kebersihan berstandar internasional yang menjamin ruang steril setiap saat.", color: "from-teal-400 to-teal-600", shadow: "shadow-teal-500/20", iconColor: "text-teal-600", bgIcon: "bg-teal-50" },
                { icon: Activity, title: "Laboratorium Terpadu", desc: "Fasilitas diagnostik in-house kami memberikan hasil yang presisi dan instan.", color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20", iconColor: "text-purple-600", bgIcon: "bg-purple-50" },
                { icon: Clock, title: "Tanpa Antrean Lama", desc: "Ekosistem digital membuat Anda hemat waktu dengan penjadwalan presisi.", color: "from-orange-400 to-orange-500", shadow: "shadow-orange-500/20", iconColor: "text-orange-500", bgIcon: "bg-orange-50" },
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-3xl flex gap-6 items-start group hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.color} shadow-lg ${item.shadow} text-white transform group-hover:rotate-6 transition-transform duration-300`}>
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative w-full aspect-square max-w-lg mx-auto lg:ml-auto perspective-1000">
               {/* 3D Glass Artwork */}
               <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-orange-50 rounded-full blur-3xl opacity-70 animate-blob mix-blend-multiply"></div>
               <div className="relative w-full h-full glass-card rounded-[40px] p-6 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-700">
                  <img
                    src="https://images.unsplash.com/photo-1519494140681-8b17d7b0f693?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium Healthcare"
                    className="w-full h-full object-cover rounded-[32px]"
                  />
                  {/* Overlay Gradient on Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 m-6 rounded-[32px]"></div>

                  <div className="absolute bottom-12 left-12 right-12 z-20">
                    <div className="glass-panel rounded-2xl p-5 border border-white/30 backdrop-blur-md">
                      <p className="text-slate-800 font-extrabold text-lg flex items-center gap-2 relative">
                         "Saya merasa seperti dirawat oleh keluarga sendiri."
                      </p>
                      <p className="text-slate-500 text-sm font-semibold mt-2">– Anisa, Pasien</p>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="fitur" className="py-28 bg-[#0F172A] relative overflow-hidden">

        {/* Dark aesthetic background accents */}
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">Teknologi di Genggaman <br/>Untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Kesehatan Maksimal</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Bukan hanya janji, tapi platform yang secara nyata memudahkan administrasi medis Anda agar bisa fokus pada proses penyembuhan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CalendarCheck, title: "Booking Online", desc: "Pilih jadwal, atur pertemuan hitungan detik.", gradient: "from-blue-400 to-blue-600" },
              { icon: Stethoscope, title: "Telekonsultasi", desc: "Temui dokter ahli via video hd, kapan pun di mana pun.", gradient: "from-pink-400 to-rose-500" },
              { icon: Activity, title: "Health Tracker", desc: "Sinkronisasi otomatis dengan health kit di smartphone.", gradient: "from-teal-400 to-emerald-500" },
              { icon: ShieldCheck, title: "Resep Digital", desc: "Tebus obat yang diresepkan dan langsung antar ke pintu.", gradient: "from-orange-400 to-amber-500" }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-[#1E293B]/80 backdrop-blur-sm border border-slate-700/50 p-8 rounded-[32px] hover:bg-[#1E293B] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                  <feature.icon size={28} />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed relative z-10">
                  {feature.desc}
                </p>

                <div className="mt-8 flex items-center text-sm font-bold text-slate-300 group-hover:text-white transition-colors cursor-pointer relative z-10">
                  <span>Pelajari lebih lanjut</span>
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-28 bg-[#FAFAFC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 flex justify-center relative">

              <div className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-emerald-100 rounded-full blur-[100px] opacity-60"></div>

              {/* Premium Phone Mockup Display */}
              <div className="relative w-[320px] h-[650px] bg-white rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-2 border-slate-200 border transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 z-10">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30"></div>

                <div className="w-full h-full overflow-hidden rounded-[40px] relative bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=800&q=80"
                    alt="App Screen UI Design"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* UI App Overlay Elements to make it feel like real app mockup */}
                   <div className="absolute bottom-6 inset-x-6">
                      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/90">
                         <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-800 text-sm">Booking Sukses</p>
                            <p className="text-xs font-semibold text-slate-500">Dr. Sarah - 10:00 AM</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-[250px] h-[300px] bg-gradient-to-tl from-orange-400 to-orange-300 rounded-[40px] rotate-[10deg] opacity-20 blur-xl z-0"></div>

            </div>

            <div className="w-full lg:w-1/2 z-20">
              <div className="mb-12">
                <p className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Onboarding 🎯</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">5 Langkah Menuju <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Hidup Lebih Sehat</span></h2>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-teal-200 to-transparent rounded-full"></div>

                {[
                  { step: "01", title: "Unduh Aplikasi", desc: "Tersedia gratis di App Store dan Google Play. Daftar dalam 1 menit." },
                  { step: "02", title: "Cari Layanan Medis", desc: "Temukan spesialis, paket check-up, atau layanan home care favorit Anda." },
                  { step: "03", title: "Pilih Jadwal", desc: "Tentukan waktu yang pas, tanpa perlu menyesuaikan waktu Anda dengan antrean klinik." },
                  { step: "04", title: "Lakukan Konsultasi", desc: "Hadir langsung ke klinik tanpa antre, atau lakukan telemedis dari rumah." },
                  { step: "05", title: "Tebus Obat Otomatis", desc: "Resep akan langsung diproses dan diantar oleh kurir instan kami." },
                ].map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-8 group pb-2">
                    <div className="relative z-10 w-14 h-14 bg-white border-4 border-[#FAFAFC] shadow-lg rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-extrabold text-teal-600 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 transform group-hover:scale-110">
                      {item.step}
                    </div>
                    <div className="pt-2 bg-white/0 p-4 rounded-2xl group-hover:bg-white group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 -ml-4 pl-4 w-full border border-transparent group-hover:border-slate-100">
                      <h3 className="text-xl font-extrabold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-20 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
         <div className="w-full bg-slate-900 rounded-[40px] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-slate-900 opacity-90"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
               <div className="text-center lg:text-left max-w-2xl">
                  <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">Siap untuk Pengalaman Baru?</h2>
                  <p className="text-slate-300 text-lg font-medium">Jadilah bagian dari revolusi kesehatan. Unduh aplikasinya sekarang dan dapatkan diskon 20% untuk konsultasi pertama.</p>
               </div>
               <div className="flex-shrink-0">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95 px-10 h-16 rounded-full font-extrabold text-lg transition-all shadow-[0_10px_20px_rgba(255,255,255,0.2)]">
                     Unduh Sekarang
                  </Button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer id="tentang" className="bg-[#0b1324] text-white pt-24 pb-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">

            {/* Lokasi / Map */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-teal-500/20">
                   <HeartPulse className="w-full h-full text-white" />
                </div>
                <span className="font-extrabold text-3xl tracking-tight">Sehati Medika</span>
              </div>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Menjadi standar emas layanan purna-waktu untuk klinik kesehatan dengan pendekatan holistik.
              </p>

              <div className="w-full h-48 bg-slate-800 rounded-2xl overflow-hidden mt-6 relative shadow-inner border border-slate-700/50 group">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Map Location"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                  <div className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={28} className="text-teal-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Navigasi */}
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-xl font-bold border-l-4 border-orange-500 pl-3 mb-6 text-white">Eksplorasi</h4>
              <ul className="space-y-4">
                {['Beranda', 'Kategori Layanan', 'Fitur Aplikasi', 'Riwayat Dokter', 'Karir (Hiring)'].map(item => (
                   <li key={item}>
                     <a href="#" className="text-slate-400 font-medium hover:text-teal-400 hover:translate-x-2 transition-all inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-0 transition-opacity"></span>
                        {item}
                     </a>
                   </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-xl font-bold border-l-4 border-teal-500 pl-3 mb-6 text-white">Hubungi Kami</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 bg-slate-800 p-3 rounded-xl border border-slate-700 group-hover:bg-teal-500/10 transition-colors"><MapPin size={22} className="text-teal-400" /></div>
                  <span className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">Jl. Sehat Bersama No. 123, Kebayoran Baru, Jakarta Selatan 12110</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 group-hover:bg-teal-500/10 transition-colors"><Phone size={22} className="text-teal-400" /></div>
                  <span className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">+62 811 2233 4455 <br/><span className="text-sm text-slate-500">(Layanan WhatsApp 24/7)</span></span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 group-hover:bg-teal-500/10 transition-colors"><Mail size={22} className="text-teal-400" /></div>
                  <span className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">halo@sehatimedika.id</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Section */}
          <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 font-medium text-sm">
              © {new Date().getFullYear()} Sehati Medika. Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-6 text-sm font-medium">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Informasi Privasi</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default Home;
