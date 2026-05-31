import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Bell,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Globe2,
    HeartPulse,
    Mail,
    MapPin,
    Phone,
    Smartphone,
    Smile,
    Star,
    Stethoscope,
    Users,
} from 'lucide-react';

function Home() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
            <div
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="flex min-h-screen flex-col overflow-x-hidden bg-[#FAFAFC] text-slate-800 selection:bg-[#04989F]/30 selection:text-[#04989F]"
            >
                {/* Decorative Top Blur */}
                <div className="pointer-events-none absolute top-0 right-0 z-0 h-[500px] w-[500px] rounded-full bg-[#04989F]/5 blur-[100px]"></div>
                <div className="pointer-events-none absolute top-[-100px] left-[-100px] z-0 h-[400px] w-[400px] rounded-full bg-[#D66604]/5 blur-[100px]"></div>

                {/* Navbar */}
                <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="group flex flex-shrink-0 cursor-pointer items-center gap-3">
                                <img src="/logo.png" alt="Sehati Medika" className="h-10 w-auto object-contain" />
                                <span className="text-2xl font-bold tracking-tight text-slate-900">Sehati Medika</span>
                            </div>
                            <div className="hidden items-center space-x-10 md:flex">
                                {['Beranda', 'Tentang Kami', 'Fitur'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(' ', '')}`}
                                        className="group relative text-sm font-semibold text-slate-600 transition-colors hover:text-[#04989F]"
                                    >
                                        {item}
                                        <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-[#04989F] transition-all group-hover:w-full"></span>
                                    </a>
                                ))}
                                <Link
                                    href="#kontak"
                                    className="group relative text-sm font-semibold text-slate-600 transition-colors hover:text-[#04989F]"
                                >
                                    Kontak
                                    <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-[#04989F] transition-all group-hover:w-full"></span>
                                </Link>
                            </div>
                            <div className="animate-slide-up hidden items-center gap-4 md:flex">
                                <Link href="/login" className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#04989F]">
                                    Masuk
                                </Link>
                                {/* <Link href="/register" className="bg-[#04989F] hover:bg-[#037d83] text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block">
                  Daftar
                </Link> */}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section id="beranda" className="relative z-10 w-full overflow-hidden bg-gradient-to-b from-white to-[#FAFAFC] pt-20 pb-28">
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">
                            <div className="z-20 w-full space-y-8 pt-10 text-center lg:w-[50%] lg:text-left">
                                <div className="animate-slide-up inline-flex items-center gap-2 rounded-full bg-[#04989F]/10 px-4 py-2 text-sm font-bold text-[#04989F]">
                                    <HeartPulse size={16} className="text-[#04989F]" />
                                    Selamat Datang di Sehati Medika!
                                </div>

                                <h1 className="animate-slide-up animation-delay-200 text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 lg:text-6xl">
                                    Sahabat Keluarga <span className="text-[#04989F]">Anda</span>
                                </h1>

                                <p className="animate-slide-up animation-delay-400 mx-auto max-w-xl text-lg leading-relaxed font-medium text-slate-600 lg:mx-0">
                                    Sehati Medika adalah solusi sederhana dan terpercaya untuk kebutuhan kesehatan sehari-hari. Dengan fokus pada
                                    layanan poli umum, Sehati Medika membantu Anda mendapatkan pemeriksaan, konsultasi, dan penanganan medis dengan
                                    cepat dan tepat.
                                </p>

                                <div className="animate-slide-up animation-delay-400 flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                                    <Button
                                        size="lg"
                                        className="flex h-14 transform items-center justify-center gap-3 rounded-xl border-0 bg-[#04989F] px-8 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#037d83] hover:shadow-xl"
                                    >
                                        Konsultasi Sekarang <ArrowRight size={20} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex h-14 items-center justify-center gap-3 rounded-xl border-slate-200 bg-white px-8 text-lg font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                                    >
                                        <Phone size={20} className="text-[#04989F]" /> Hubungi Klinik
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mt-16 flex h-[500px] w-full items-center justify-center lg:mt-0 lg:w-[50%]">
                                {/* Clean, Neat UI Composition instead of Sci-fi Orbs */}
                                <div className="relative flex h-full w-full max-w-[500px] items-center justify-center">
                                    {/* Base Circle Decoration */}
                                    <div className="absolute z-0 h-[400px] w-[400px] rounded-full bg-[#04989F]/5"></div>

                                    {/* Main Card */}
                                    <div className="animate-float relative z-10 w-80 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
                                        <div className="mb-6 flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#04989F]/10">
                                                <Stethoscope size={24} className="text-[#04989F]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Poli Umum</h4>
                                                <p className="text-sm text-slate-500">Buka Hari Ini</p>
                                            </div>
                                            <div className="ml-auto h-3 w-3 animate-pulse rounded-full bg-emerald-500"></div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                                <CheckCircle2 size={18} className="text-[#04989F]" />
                                                <span className="text-sm font-medium text-slate-700">Pelayanan Cepat</span>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                                <CheckCircle2 size={18} className="text-[#04989F]" />
                                                <span className="text-sm font-medium text-slate-700">Dokter Berpengalaman</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Card Right */}
                                    <div className="animate-float-delayed absolute top-1/4 -right-4 z-20 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D66604]/10">
                                            <Smile size={20} className="text-[#D66604]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Ramah Anak</p>
                                            <p className="text-xs text-slate-500">Semua Kalangan</p>
                                        </div>
                                    </div>

                                    {/* Floating Card Bottom */}
                                    <div className="animate-float absolute bottom-1/4 -left-8 z-20 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#04989F]/10">
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
                <section id="tentangkami" className="relative border-y border-slate-100 bg-white pt-12 pb-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header / Title Centered */}
                        <div className="mx-auto mb-12 max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#04989F]/10 px-4 py-2 text-sm font-bold text-[#04989F]">
                                <Star size={16} /> Keunggulan Kami
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                                Mengapa Harus <span className="text-[#04989F]">Sehati Medika?</span>
                            </h2>
                            <p className="text-lg font-medium text-slate-600">
                                Kami berkomitmen memberikan pelayanan medis yang terbaik, cepat, dan nyaman untuk Anda dan keluarga.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-16 lg:flex-row">
                            {/* Image Section */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-[#04989F]/20 to-[#D66604]/20 blur-xl"></div>
                                    <img
                                        src="/klinik.png"
                                        alt="Klinik Sehati Medika"
                                        className="relative h-[450px] w-full rounded-3xl object-cover shadow-2xl"
                                    />

                                    {/* Floating badge */}
                                    <div className="animate-float absolute -right-6 -bottom-6 hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-xl sm:block">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#04989F]/10">
                                                <Star className="text-[#04989F]" size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Terpercaya</p>
                                                <p className="text-[10px] tracking-wider text-slate-500 uppercase">Pilihan Keluarga</p>
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
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#04989F]/10 text-[#04989F]">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">Pelayanan Cepat & Praktis</h3>
                                            <p className="text-sm leading-relaxed font-medium text-slate-600">
                                                Datang, periksa, dan langsung ditangani dengan alur yang jelas dan efisien.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#D66604]/10 text-[#D66604]">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">Fokus Kebutuhan Dasar</h3>
                                            <p className="text-sm leading-relaxed font-medium text-slate-600">
                                                Menangani berbagai keluhan sehari-hari seperti demam, flu, hingga kontrol rutin.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#04989F]/10 text-[#04989F]">
                                            <Stethoscope size={20} />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">Tenaga Medis Profesional</h3>
                                            <p className="text-sm leading-relaxed font-medium text-slate-600">
                                                Ditangani oleh tenaga kesehatan tersertifikasi yang berpengalaman.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 4 */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#D66604]/10 text-[#D66604]">
                                            <Smile size={20} />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">Suasana Nyaman & Ramah</h3>
                                            <p className="text-sm leading-relaxed font-medium text-slate-600">
                                                Pelayanan tidak kaku, santai tapi tetap profesional dan mengutamakan pasien.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 5 */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#04989F]/10 text-[#04989F]">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">Cocok Untuk Semua Kalangan</h3>
                                            <p className="text-sm leading-relaxed font-medium text-slate-600">
                                                Akses layanan medis yang ramah untuk anak-anak, remaja, hingga dewasa.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fitur Utama */}
                <section id="fitur" className="relative overflow-hidden bg-[#FAFAFC] py-28">
                    {/* Decorative Background Elements */}
                    <div className="pointer-events-none absolute top-0 right-0 z-0 h-[800px] w-[800px] rounded-full bg-[#04989F]/5 blur-[120px]"></div>
                    <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[800px] w-[800px] rounded-full bg-[#D66604]/5 blur-[120px]"></div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-20 text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-bold text-[#04989F] shadow-sm">
                                <Globe2 size={16} /> Platform Terintegrasi
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                                Fitur <span className="text-[#04989F]">Utama</span>
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-600">
                                Nikmati kemudahan layanan kesehatan digital yang dirancang khusus untuk kenyamanan dan kepraktisan Anda.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
                            {/* Feature 1 - Highlighted */}
                            <div className="group relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#04989F] to-[#037d83] p-10 shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/20 shadow-inner backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                                        <FileText size={36} className="text-white" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Rekam Medis Digital</h3>
                                    <p className="flex-grow text-lg leading-relaxed font-medium text-white/90">
                                        Riwayat kesehatan Anda tersimpan dengan aman, rapi, dan mudah diakses kapan saja untuk kebutuhan kontrol
                                        berikutnya.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 - Standard Light Card */}
                            <div className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:border-[#04989F]/30">
                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#04989F]/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#04989F] group-hover:shadow-lg">
                                        <CalendarCheck size={36} className="text-[#04989F] transition-colors group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-slate-900">Antrian Real-time</h3>
                                    <p className="flex-grow text-lg leading-relaxed font-medium text-slate-600">
                                        Pantau nomor antrian secara langsung dari smartphone Anda tanpa harus menunggu lama dan bosan di ruang tunggu
                                        klinik.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 - Standard Light Card */}
                            <div className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:border-[#D66604]/30">
                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#D66604]/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#D66604] group-hover:shadow-lg">
                                        <Bell size={36} className="text-[#D66604] transition-colors group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-slate-900">Pengingat Obat</h3>
                                    <p className="flex-grow text-lg leading-relaxed font-medium text-slate-600">
                                        Fitur alarm otomatis yang terintegrasi untuk memastikan Anda tidak pernah melewatkan jadwal minum obat tepat
                                        waktu.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cara Kerja / Onboarding - Simplification */}
                <section className="relative overflow-hidden border-y border-slate-100 bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-16 lg:flex-row">
                            <div className="z-20 w-full lg:w-1/2">
                                <div className="mb-10">
                                    <h3 className="mb-2 text-sm font-bold tracking-wider text-[#04989F] uppercase">Panduan Pengguna</h3>
                                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                                        Langkah Mudah Menuju Kesehatan Optimal
                                    </h2>
                                    <p className="text-lg font-medium text-slate-600">
                                        Hanya butuh beberapa langkah sederhana untuk mulai menikmati fasilitas kesehatan yang terintegrasi dan modern.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        {
                                            step: '1',
                                            title: 'Unduh Aplikasi',
                                            desc: 'Tersedia gratis di App Store dan Google Play. Daftar dalam 1 menit.',
                                        },
                                        {
                                            step: '2',
                                            title: 'Cari Layanan Medis',
                                            desc: 'Temukan spesialis, paket check-up, atau layanan home care favorit Anda.',
                                        },
                                        {
                                            step: '3',
                                            title: 'Pilih Jadwal',
                                            desc: 'Tentukan waktu yang pas, tanpa perlu menyesuaikan waktu dengan antrean.',
                                        },
                                        {
                                            step: '4',
                                            title: 'Lakukan Konsultasi',
                                            desc: 'Hadir ke klinik tanpa antre, atau lakukan telemedis dari rumah.',
                                        },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-6">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#04989F]/10 text-xl font-bold text-[#04989F]">
                                                {item.step}
                                            </div>
                                            <div className="w-full pt-1">
                                                <h3 className="mb-1 text-xl font-bold text-slate-900">{item.title}</h3>
                                                <p className="font-medium text-slate-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex w-full justify-center lg:w-1/2">
                                <div className="w-full max-w-md rounded-[40px] border border-slate-100 bg-slate-50 p-8 shadow-lg">
                                    <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900">Jadwal Anda</h4>
                                            <CalendarCheck className="text-[#04989F]" size={20} />
                                        </div>
                                        <div className="mb-4 rounded-xl border border-[#04989F]/20 bg-[#04989F]/10 p-4">
                                            <p className="mb-1 text-sm font-bold text-[#04989F]">Hari ini, 09:00 WIB</p>
                                            <p className="font-bold text-slate-900">Poli Umum</p>
                                            <p className="text-sm text-slate-600">dr. Anita Lestari</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="mb-1 text-sm font-bold text-slate-500">Besok, 13:00 WIB</p>
                                            <p className="font-bold text-slate-900">Pemeriksaan Rutin</p>
                                            <p className="text-sm text-slate-600">Klinik Sehati</p>
                                        </div>
                                    </div>
                                    <div className="rounded-3xl bg-[#04989F] p-6 text-white shadow-md">
                                        <div className="mb-4 flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                                <Bell size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">Pengingat Obat</h4>
                                                <p className="text-sm text-white/80">Paracetamol - Setelah Makan</p>
                                            </div>
                                        </div>
                                        <Button className="w-full rounded-xl bg-white font-bold text-[#04989F] hover:bg-slate-50">
                                            Sudah Diminum
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pre-Footer CTA */}
                <section className="bg-[#FAFAFC] py-20">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="relative w-full overflow-hidden rounded-[40px] bg-[#04989F] p-12 text-center shadow-xl lg:p-16">
                            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-[80px]"></div>
                            <div className="relative z-10">
                                <h2 className="mb-6 text-3xl font-extrabold text-white lg:text-4xl">Unduh Aplikasi Mobile Kami</h2>
                                <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/90">
                                    Dapatkan kemudahan layanan kesehatan dalam satu genggaman. Gunakan fitur pengingat obat khusus untuk Anda, pantau
                                    nomor antrian secara langsung, dan akses riwayat periksa kapan saja.
                                </p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <Button
                                        size="lg"
                                        className="flex h-14 items-center gap-3 rounded-xl border-0 bg-slate-900 px-8 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800"
                                    >
                                        <Smartphone size={24} /> Google Play
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="kontak" className="mt-auto border-t border-slate-800 bg-slate-900 pt-24 pb-12 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
                            {/* Lokasi / Map */}
                            <div className="space-y-8 lg:col-span-5">
                                <div className="mb-6 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 pr-4">
                                    <img src="/logo.png" alt="Sehati Medika" className="h-10 w-auto rounded-xl bg-white object-contain p-1" />
                                    <span className="text-2xl font-extrabold tracking-tight">Sehati Medika</span>
                                </div>
                                <p className="text-lg leading-relaxed font-medium text-slate-400">
                                    Menjadi standar emas layanan medis dengan pendekatan profesional, ramah, dan terpercaya untuk seluruh kalangan
                                    masyarakat.
                                </p>

                                {/* Map Iframe */}
                                <div className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
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
                                <a
                                    href="https://share.google/JmGyZPTr2YqkZI9Hi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-bold text-[#04989F] transition-colors hover:text-white"
                                >
                                    <MapPin size={20} /> Buka Peta di Google Maps
                                </a>
                            </div>

                            {/* Menu Navigasi */}
                            <div className="space-y-6 lg:col-span-3">
                                <h4 className="mb-6 text-xl font-bold text-white">Eksplorasi</h4>
                                <ul className="space-y-4">
                                    {['Beranda', 'Tentang Kami', 'Fitur Utama'].map((item) => (
                                        <li key={item}>
                                            <a
                                                href={`#${item.toLowerCase().replace(' ', '')}`}
                                                className="inline-flex items-center gap-2 font-medium text-slate-400 transition-all hover:translate-x-2 hover:text-[#04989F]"
                                            >
                                                <ChevronRight size={16} />
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div className="space-y-6 lg:col-span-4">
                                <h4 className="mb-6 text-xl font-bold text-white">Hubungi Kami</h4>
                                <ul className="space-y-6">
                                    <li className="group flex items-start gap-4">
                                        <div className="mt-1 rounded-xl border border-slate-700 bg-slate-800 p-3">
                                            <MapPin size={20} className="text-[#04989F]" />
                                        </div>
                                        <span className="leading-relaxed font-medium text-slate-400">
                                            Jl. Danau Toba No.31, Lingkungan Panji, Tegalgede, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68124
                                        </span>
                                    </li>
                                    <li className="group flex items-center gap-4">
                                        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                                            <Phone size={20} className="text-[#04989F]" />
                                        </div>
                                        <span className="leading-relaxed font-medium text-slate-400">
                                            0822-1013-0822 <br />
                                            <span className="text-sm text-slate-500">(Layanan WhatsApp)</span>
                                        </span>
                                    </li>
                                    <li className="group flex items-center gap-4">
                                        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                                            <Mail size={20} className="text-[#04989F]" />
                                        </div>
                                        <span className="leading-relaxed font-medium text-slate-400">halo@sehatimedika.id</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-center md:flex-row">
                            <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} Sehati Medika. Hak Cipta Dilindungi.</p>
                            <div className="flex gap-6 text-sm font-medium">
                                <a href="#" className="text-slate-500 transition-colors hover:text-white">
                                    Informasi Privasi
                                </a>
                                <a href="#" className="text-slate-500 transition-colors hover:text-white">
                                    Syarat & Ketentuan
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Home;
