import {
  HeartPulse,
  Stethoscope,
  Clock,
  ShieldCheck,
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Activity,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Globe2,
  Users,
  Smile,
  FileText,
  Bell,
  Check,
  Star
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
      <div style={{ fontFamily: "'Inter', sans-serif" }} className="text-slate-800 bg-[#FAFAFC] flex flex-col min-h-screen overflow-x-hidden selection:bg-[#04989F]/30 selection:text-[#04989F]">

        {/* Decorative Top Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#04989F]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#D66604]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                <img src="/logo.png" alt="Sehati Medika" className="h-10 w-auto object-contain" />
                <span className="font-bold text-2xl tracking-tight text-slate-900">Sehati Medika</span>
              </div>
              <div className="hidden md:flex space-x-10 items-center">
                {['Beranda', 'Tentang Kami', 'Fitur'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-sm font-semibold text-slate-600 hover:text-[#04989F] transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#04989F] transition-all group-hover:w-full rounded-full"></span>
                  </a>
                ))}
                <Link href="#kontak" className="text-sm font-semibold text-slate-600 hover:text-[#04989F] transition-colors relative group">
                  Kontak
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#04989F] transition-all group-hover:w-full rounded-full"></span>
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-4 animate-slide-up">
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[#04989F] transition-colors">Masuk</Link>
                <Link href="/register" className="bg-[#04989F] hover:bg-[#037d83] text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block">
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="beranda" className="pt-20 pb-28 relative z-10 w-full overflow-hidden bg-gradient-to-b from-white to-[#FAFAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              <div className="w-full lg:w-[50%] space-y-8 text-center lg:text-left z-20 pt-10">

                <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04989F]/10 text-[#04989F] font-bold text-sm">
                  <HeartPulse size={16} className="text-[#04989F]" />
                  Selamat Datang di Sehati Medika!
                </div>

                <h1 className="animate-slide-up animation-delay-200 text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                  Sahabat Keluarga <span className="text-[#04989F]">Anda</span>
                </h1>

                <p className="animate-slide-up animation-delay-400 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                  Sehati Medika adalah solusi sederhana dan terpercaya untuk kebutuhan kesehatan sehari-hari. Dengan fokus pada layanan poli umum, Sehati Medika membantu Anda mendapatkan pemeriksaan, konsultasi, dan penanganan medis dengan cepat dan tepat.
                </p>

                <div className="animate-slide-up animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Button size="lg" className="bg-[#04989F] hover:bg-[#037d83] text-white px-8 h-14 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 border-0">
                    Konsultasi Sekarang <ArrowRight size={20} />
                  </Button>
                  <Button variant="outline" size="lg" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 px-8 h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm">
                    <Phone size={20} className="text-[#04989F]" /> Hubungi Klinik
                  </Button>
                </div>

              </div>

              <div className="w-full lg:w-[50%] relative mt-16 lg:mt-0 flex justify-center items-center h-[500px]">
                {/* Clean, Neat UI Composition instead of Sci-fi Orbs */}
                <div className="relative w-full max-w-[500px] h-full flex items-center justify-center">
                  
                  {/* Base Circle Decoration */}
                  <div className="absolute w-[400px] h-[400px] bg-[#04989F]/5 rounded-full z-0"></div>
                  
                  {/* Main Card */}
                  <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 w-80 animate-float">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#04989F]/10 flex items-center justify-center">
                        <Stethoscope size={24} className="text-[#04989F]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Poli Umum</h4>
                        <p className="text-sm text-slate-500">Buka Hari Ini</p>
                      </div>
                      <div className="ml-auto w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <CheckCircle2 size={18} className="text-[#04989F]" />
                          <span className="text-sm font-medium text-slate-700">Pelayanan Cepat</span>
                       </div>
                       <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <CheckCircle2 size={18} className="text-[#04989F]" />
                          <span className="text-sm font-medium text-slate-700">Dokter Berpengalaman</span>
                       </div>
                    </div>
                  </div>

                  {/* Floating Card Right */}
                  <div className="absolute top-1/4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 animate-float-delayed z-20">
                     <div className="w-10 h-10 rounded-full bg-[#D66604]/10 flex items-center justify-center">
                        <Smile size={20} className="text-[#D66604]" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Ramah Anak</p>
                        <p className="text-xs text-slate-500">Semua Kalangan</p>
                     </div>
                  </div>

                  {/* Floating Card Bottom */}
                  <div className="absolute bottom-1/4 -left-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 animate-float z-20">
                     <div className="w-10 h-10 rounded-full bg-[#04989F]/10 flex items-center justify-center">
                        <Clock size={20} className="text-[#04989F]" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">Praktis</p>
                        <p className="text-xs text-slate-500">Tanpa Antre Lama</p>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tentang Kami / Mengapa Harus Sehati Medika */}
        <section id="tentangkami" className="pt-12 pb-28 relative bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header / Title Centered */}
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04989F]/10 text-[#04989F] font-bold text-sm mb-6">
                 <Star size={16} /> Keunggulan Kami
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Mengapa Harus <span className="text-[#04989F]">Sehati Medika?</span></h2>
              <p className="text-slate-600 text-lg font-medium">Kami berkomitmen memberikan pelayanan medis yang terbaik, cepat, dan nyaman untuk Anda dan keluarga.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <div className="relative">
                   <div className="absolute -inset-4 bg-gradient-to-r from-[#04989F]/20 to-[#D66604]/20 rounded-[40px] blur-xl"></div>
                   <img src="/2021-06-24.webp" alt="Klinik Sehati Medika" className="relative w-full h-[450px] object-cover rounded-3xl shadow-2xl" />
                   
                   {/* Floating badge */}
                   <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 animate-float hidden sm:block">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-[#04989F]/10 rounded-full flex items-center justify-center">
                            <Star className="text-[#04989F]" size={16} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">Terpercaya</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Pilihan Keluarga</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Text Section (Urut ke bawah) */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#04989F]/10 flex items-center justify-center flex-shrink-0 text-[#04989F]">
                        <Clock size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Pelayanan Cepat & Praktis</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Datang, periksa, dan langsung ditangani dengan alur yang jelas dan efisien.</p>
                     </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#D66604]/10 flex items-center justify-center flex-shrink-0 text-[#D66604]">
                        <Activity size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Fokus Kebutuhan Dasar</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Menangani berbagai keluhan sehari-hari seperti demam, flu, hingga kontrol rutin.</p>
                     </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#04989F]/10 flex items-center justify-center flex-shrink-0 text-[#04989F]">
                        <Stethoscope size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Tenaga Medis Profesional</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Ditangani oleh tenaga kesehatan tersertifikasi yang berpengalaman.</p>
                     </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#D66604]/10 flex items-center justify-center flex-shrink-0 text-[#D66604]">
                        <Smile size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Suasana Nyaman & Ramah</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Pelayanan tidak kaku, santai tapi tetap profesional dan mengutamakan pasien.</p>
                     </div>
                  </div>

                  {/* Item 5 */}
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#04989F]/10 flex items-center justify-center flex-shrink-0 text-[#04989F]">
                        <Users size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Cocok Untuk Semua Kalangan</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Akses layanan medis yang ramah untuk anak-anak, remaja, hingga dewasa.</p>
                     </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Fitur Utama */}
        <section id="fitur" className="py-28 bg-[#FAFAFC] relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#04989F]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#D66604]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#04989F] shadow-sm font-bold text-sm mb-6 border border-slate-100">
                 <Globe2 size={16} /> Platform Terintegrasi
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Fitur <span className="text-[#04989F]">Utama</span></h2>
              <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto font-medium">Nikmati kemudahan layanan kesehatan digital yang dirancang khusus untuk kenyamanan dan kepraktisan Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 - Highlighted */}
              <div className="relative group rounded-[40px] p-10 overflow-hidden shadow-2xl bg-gradient-to-br from-[#04989F] to-[#037d83] hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col h-full">
                   <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <FileText size={36} className="text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-4">Rekam Medis Digital</h3>
                   <p className="text-white/90 font-medium leading-relaxed flex-grow text-lg">
                     Riwayat kesehatan Anda tersimpan dengan aman, rapi, dan mudah diakses kapan saja untuk kebutuhan kontrol berikutnya.
                   </p>
                </div>
              </div>

              {/* Feature 2 - Standard Light Card */}
              <div className="relative group rounded-[40px] p-10 overflow-hidden shadow-xl shadow-slate-200/50 bg-white border border-slate-100 hover:border-[#04989F]/30 hover:-translate-y-2 transition-all duration-300">
                <div className="relative z-10 flex flex-col h-full">
                   <div className="w-20 h-20 rounded-3xl bg-[#04989F]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#04989F] group-hover:shadow-lg">
                      <CalendarCheck size={36} className="text-[#04989F] group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">Antrian Real-time</h3>
                   <p className="text-slate-600 font-medium leading-relaxed flex-grow text-lg">
                     Pantau nomor antrian secara langsung dari smartphone Anda tanpa harus menunggu lama dan bosan di ruang tunggu klinik.
                   </p>
                </div>
              </div>

              {/* Feature 3 - Standard Light Card */}
              <div className="relative group rounded-[40px] p-10 overflow-hidden shadow-xl shadow-slate-200/50 bg-white border border-slate-100 hover:border-[#D66604]/30 hover:-translate-y-2 transition-all duration-300">
                <div className="relative z-10 flex flex-col h-full">
                   <div className="w-20 h-20 rounded-3xl bg-[#D66604]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#D66604] group-hover:shadow-lg">
                      <Bell size={36} className="text-[#D66604] group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">Pengingat Obat</h3>
                   <p className="text-slate-600 font-medium leading-relaxed flex-grow text-lg">
                     Fitur alarm otomatis yang terintegrasi untuk memastikan Anda tidak pernah melewatkan jadwal minum obat tepat waktu.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cara Kerja / Onboarding - Simplification */}
        <section className="py-24 bg-white relative overflow-hidden border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <div className="w-full lg:w-1/2 z-20">
                <div className="mb-10">
                  <h3 className="text-[#04989F] font-bold uppercase text-sm tracking-wider mb-2">Panduan Pengguna</h3>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Langkah Mudah Menuju Kesehatan Optimal</h2>
                  <p className="text-slate-600 font-medium text-lg">Hanya butuh beberapa langkah sederhana untuk mulai menikmati fasilitas kesehatan yang terintegrasi dan modern.</p>
                </div>

                <div className="space-y-8">
                  {[
                    { step: "1", title: "Unduh Aplikasi", desc: "Tersedia gratis di App Store dan Google Play. Daftar dalam 1 menit." },
                    { step: "2", title: "Cari Layanan Medis", desc: "Temukan spesialis, paket check-up, atau layanan home care favorit Anda." },
                    { step: "3", title: "Pilih Jadwal", desc: "Tentukan waktu yang pas, tanpa perlu menyesuaikan waktu dengan antrean." },
                    { step: "4", title: "Lakukan Konsultasi", desc: "Hadir ke klinik tanpa antre, atau lakukan telemedis dari rumah." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#04989F]/10 flex items-center justify-center flex-shrink-0 text-xl font-bold text-[#04989F]">
                        {item.step}
                      </div>
                      <div className="pt-1 w-full">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-slate-600 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center relative">
                 <div className="w-full max-w-md bg-slate-50 border border-slate-100 p-8 rounded-[40px] shadow-lg">
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm mb-6">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="font-bold text-slate-900">Jadwal Anda</h4>
                          <CalendarCheck className="text-[#04989F]" size={20} />
                       </div>
                       <div className="bg-[#04989F]/10 p-4 rounded-xl border border-[#04989F]/20 mb-4">
                          <p className="text-sm font-bold text-[#04989F] mb-1">Hari ini, 09:00 WIB</p>
                          <p className="font-bold text-slate-900">Poli Umum</p>
                          <p className="text-sm text-slate-600">dr. Anita Lestari</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-500 mb-1">Besok, 13:00 WIB</p>
                          <p className="font-bold text-slate-900">Pemeriksaan Rutin</p>
                          <p className="text-sm text-slate-600">Klinik Sehati</p>
                       </div>
                    </div>
                    <div className="bg-[#04989F] p-6 rounded-3xl text-white shadow-md">
                       <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                             <Bell size={24} className="text-white" />
                          </div>
                          <div>
                             <h4 className="font-bold">Pengingat Obat</h4>
                             <p className="text-white/80 text-sm">Paracetamol - Setelah Makan</p>
                          </div>
                       </div>
                       <Button className="w-full bg-white text-[#04989F] hover:bg-slate-50 rounded-xl font-bold">
                          Sudah Diminum
                       </Button>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pre-Footer CTA */}
        <section className="py-20 bg-[#FAFAFC]">
           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="w-full bg-[#04989F] rounded-[40px] p-12 lg:p-16 text-center shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6">Unduh Aplikasi Mobile Kami</h2>
                    <p className="text-white/90 text-lg font-medium mb-10 max-w-2xl mx-auto">
                      Dapatkan kemudahan layanan kesehatan dalam satu genggaman. Gunakan fitur pengingat obat khusus untuk Anda, pantau nomor antrian secara langsung, dan akses riwayat periksa kapan saja.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                       <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-14 rounded-xl font-bold text-lg shadow-lg border-0 transition-all hover:-translate-y-1 flex items-center gap-3">
                          <Smartphone size={24} /> Google Play
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer id="kontak" className="bg-slate-900 text-white pt-24 pb-12 mt-auto border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">

              {/* Lokasi / Map */}
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3 mb-6 bg-white/5 w-fit p-2 pr-4 rounded-2xl border border-white/10">
                  <img src="/logo.png" alt="Sehati Medika" className="h-10 w-auto object-contain bg-white rounded-xl p-1" />
                  <span className="font-extrabold text-2xl tracking-tight">Sehati Medika</span>
                </div>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Menjadi standar emas layanan medis dengan pendekatan profesional, ramah, dan terpercaya untuk seluruh kalangan masyarakat.
                </p>

                {/* Map Iframe */}
                <div className="w-full h-64 bg-slate-800 rounded-2xl overflow-hidden mt-6 relative border border-slate-700 shadow-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.3364966601614!2d113.7143160758414!3d-8.16880058161556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695b617d8f623%3A0x6b7713f019deaf0!2sJl.%20Danau%20Toba%20No.31%2C%20Lingkungan%20Panji%2C%20Tegalgede%2C%20Kec.%20Sumbersari%2C%20Kabupaten%20Jember%2C%20Jawa%20Timur%2068124!5e0!3m2!1sen!2sid!4v1714704812345!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a href="https://share.google/JmGyZPTr2YqkZI9Hi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#04989F] font-bold hover:text-white transition-colors">
                  <MapPin size={20} /> Buka Peta di Google Maps
                </a>
              </div>

              {/* Menu Navigasi */}
              <div className="lg:col-span-3 space-y-6">
                <h4 className="text-xl font-bold text-white mb-6">Eksplorasi</h4>
                <ul className="space-y-4">
                  {['Beranda', 'Tentang Kami', 'Fitur Utama'].map(item => (
                     <li key={item}>
                       <a href={`#${item.toLowerCase().replace(' ', '')}`} className="text-slate-400 font-medium hover:text-[#04989F] hover:translate-x-2 transition-all inline-flex items-center gap-2">
                          <ChevronRight size={16} />
                          {item}
                       </a>
                     </li>
                  ))}
                </ul>
              </div>

              {/* Kontak */}
              <div className="lg:col-span-4 space-y-6">
                <h4 className="text-xl font-bold text-white mb-6">Hubungi Kami</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <div className="mt-1 bg-slate-800 p-3 rounded-xl border border-slate-700"><MapPin size={20} className="text-[#04989F]" /></div>
                    <span className="text-slate-400 font-medium leading-relaxed">Jl. Danau Toba No.31, Lingkungan Panji, Tegalgede, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68124</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><Phone size={20} className="text-[#04989F]" /></div>
                    <span className="text-slate-400 font-medium leading-relaxed">0822-1013-0822 <br/><span className="text-sm text-slate-500">(Layanan WhatsApp)</span></span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><Mail size={20} className="text-[#04989F]" /></div>
                    <span className="text-slate-400 font-medium leading-relaxed">halo@sehatimedika.id</span>
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
    </>
  );
}

export default Home;
