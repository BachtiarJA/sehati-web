import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { 
    FileText, Search, Plus, Trash2, Edit, X, Save, Activity, 
    Eye, User, Stethoscope, HeartPulse, ClipboardList, Pill, AlertCircle 
} from 'lucide-react';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Rekam Medis', href: '/rekam-medis' },
];

export default function RekamMedis() {
    // Data dummy rekam medis (Expanded)
    const [rekamMedisList, setRekamMedisList] = useState([
        { 
            id: 1, 
            no_rm: 'RM-202605-001', 
            tanggal: '2026-05-01', 
            nama_pasien: 'Budi Santoso', 
            jenis_kelamin: 'Laki-laki',
            keluhan_utama: 'Demam 3 hari, menggigil saat malam', 
            tekanan_darah: '120/80',
            suhu: '38.5',
            diagnosis: 'Demam Tifoid', 
            tindakan: 'Rawat Jalan, Uji Widal', 
            dokter: 'Dr. Andi' 
        },
        { 
            id: 2, 
            no_rm: 'RM-202605-002', 
            tanggal: '2026-05-02', 
            nama_pasien: 'Siti Aminah', 
            jenis_kelamin: 'Perempuan',
            keluhan_utama: 'Batuk berdahak, sesak nafas ringan', 
            tekanan_darah: '110/70',
            suhu: '37.2',
            diagnosis: 'ISPA', 
            tindakan: 'Pemberian Nebulizer', 
            dokter: 'Dr. Budi' 
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    
    // State form baru (SOAP Format)
    const [formData, setFormData] = useState({
        // Informasi Pasien
        no_rm: '',
        nama_pasien: '',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: '',
        dokter: '',
        // S - Subjective (Anamnesis)
        keluhan_utama: '',
        riwayat_penyakit: '',
        alergi: '',
        // O - Objective (Pemeriksaan Fisik & Vital)
        tekanan_darah: '',
        nadi: '',
        suhu: '',
        pernapasan: '',
        berat_badan: '',
        tinggi_badan: '',
        pemeriksaan_fisik: '',
        // A - Assessment (Diagnosis)
        diagnosis: '',
        // P - Plan (Tatalaksana)
        tindakan: '',
        resep_obat: '',
        catatan: ''
    });

    const handleSimpanRekamMedis = () => {
        if (!formData.nama_pasien || !formData.diagnosis || !formData.keluhan_utama) return;
        
        const newEntry = {
            id: Date.now(),
            tanggal: new Date().toISOString().split('T')[0],
            ...formData
        };

        setRekamMedisList([newEntry, ...rekamMedisList]);
        
        // Reset form
        setFormData({
            no_rm: '', nama_pasien: '', jenis_kelamin: 'Laki-laki', tanggal_lahir: '', dokter: '',
            keluhan_utama: '', riwayat_penyakit: '', alergi: '',
            tekanan_darah: '', nadi: '', suhu: '', pernapasan: '', berat_badan: '', tinggi_badan: '', pemeriksaan_fisik: '',
            diagnosis: '', tindakan: '', resep_obat: '', catatan: ''
        });
        setShowModal(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekam Medis Elektronik" />
            <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Rekam Medis Elektronik (RME)</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Kelola data riwayat klinis komprehensif (SOAP) pasien.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#04989F] text-white rounded-xl hover:bg-[#037d83] transition-colors shadow-lg shadow-[#04989F]/20 text-sm font-bold"
                    >
                        <Plus size={18} />
                        Tambah RME Baru
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Search size={16} />
                            </div>
                            <input 
                                type="text" 
                                className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#04989F]/10 focus:border-[#04989F] transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none" 
                                placeholder="Cari No. RM, nama pasien, atau diagnosis..."
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">No. RM</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Pasien</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Keluhan Utama (S)</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Diagnosis (A)</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Dokter</th>
                                    <th className="px-5 py-3.5 text-[13px] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rekamMedisList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                                {item.no_rm}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-600 whitespace-nowrap">
                                            {item.tanggal}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-sm font-bold text-slate-800">{item.nama_pasien}</div>
                                            <div className="text-xs text-slate-500">{item.jenis_kelamin}</div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-600 max-w-[200px] truncate" title={item.keluhan_utama}>
                                            {item.keluhan_utama}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D66604]/10 text-[#D66604] text-[13px] font-bold border border-[#D66604]/20">
                                                <Activity size={14} />
                                                {item.diagnosis}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-600 whitespace-nowrap">
                                            {item.dokter}
                                        </td>
                                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                            <div className="flex justify-center items-center gap-1">
                                                <button className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors" title="Lihat Detail">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Rekam Medis - SOAP Format */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#04989F]/10 text-[#04989F] rounded-xl">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-800">Formulir Rekam Medis Elektronik</h2>
                                    <p className="text-xs text-slate-500 font-medium">Pengisian data klinis dengan format SOAP</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 bg-slate-50/50">
                            
                            {/* 1. Informasi Pasien */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-[#04989F]">
                                    <User size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide">Informasi Pasien</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">No. Rekam Medis</label>
                                        <input type="text" value={formData.no_rm} onChange={(e) => handleInputChange('no_rm', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none" placeholder="RM-..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Lengkap <span className="text-rose-500">*</span></label>
                                        <input type="text" value={formData.nama_pasien} onChange={(e) => handleInputChange('nama_pasien', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none" placeholder="Nama Pasien" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Jenis Kelamin</label>
                                        <select value={formData.jenis_kelamin} onChange={(e) => handleInputChange('jenis_kelamin', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none">
                                            <option>Laki-laki</option>
                                            <option>Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Dokter Pemeriksa</label>
                                        <input type="text" value={formData.dokter} onChange={(e) => handleInputChange('dokter', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none" placeholder="Nama Dokter" />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Anamnesis (Subjective) */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-[#D66604]">
                                    <ClipboardList size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide">S - Subjective (Anamnesis)</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Keluhan Utama <span className="text-rose-500">*</span></label>
                                        <textarea value={formData.keluhan_utama} onChange={(e) => handleInputChange('keluhan_utama', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none resize-none" placeholder="Keluhan yang dirasakan pasien..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Riwayat Penyakit Dahulu / Keluarga</label>
                                            <textarea value={formData.riwayat_penyakit} onChange={(e) => handleInputChange('riwayat_penyakit', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none resize-none" placeholder="Riwayat kesehatan terdahulu..." />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1.5 text-rose-500">
                                                <AlertCircle size={14} />
                                                <label className="block text-xs font-bold">Alergi (Obat/Makanan)</label>
                                            </div>
                                            <textarea value={formData.alergi} onChange={(e) => handleInputChange('alergi', e.target.value)} rows={2} className="w-full px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none placeholder:text-rose-300" placeholder="Catat jika ada alergi..." />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Pemeriksaan Vital & Fisik (Objective) */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-[#2E8B57]">
                                    <HeartPulse size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide">O - Objective (Pemeriksaan)</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Tekanan Darah</label>
                                        <div className="relative">
                                            <input type="text" value={formData.tekanan_darah} onChange={(e) => handleInputChange('tekanan_darah', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-10" placeholder="120/80" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">mmHg</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Nadi</label>
                                        <div className="relative">
                                            <input type="text" value={formData.nadi} onChange={(e) => handleInputChange('nadi', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-10" placeholder="80" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">x/mnt</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Suhu</label>
                                        <div className="relative">
                                            <input type="text" value={formData.suhu} onChange={(e) => handleInputChange('suhu', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-6" placeholder="36.5" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">°C</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Pernapasan</label>
                                        <div className="relative">
                                            <input type="text" value={formData.pernapasan} onChange={(e) => handleInputChange('pernapasan', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-10" placeholder="20" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">x/mnt</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Berat Badan</label>
                                        <div className="relative">
                                            <input type="text" value={formData.berat_badan} onChange={(e) => handleInputChange('berat_badan', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-6" placeholder="60" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">kg</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Tinggi</label>
                                        <div className="relative">
                                            <input type="text" value={formData.tinggi_badan} onChange={(e) => handleInputChange('tinggi_badan', e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 outline-none pr-6" placeholder="165" />
                                            <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium">cm</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Catatan Pemeriksaan Fisik</label>
                                    <textarea value={formData.pemeriksaan_fisik} onChange={(e) => handleInputChange('pemeriksaan_fisik', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none resize-none" placeholder="Hasil pemeriksaan fisik (kepala, leher, thorax, abdomen, dll)..." />
                                </div>
                            </section>

                            {/* 4. Diagnosis (Assessment) */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-[#8A2BE2]">
                                    <Stethoscope size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide">A - Assessment (Diagnosis)</h3>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Diagnosis Utama (ICD-10 / Medis) <span className="text-rose-500">*</span></label>
                                    <input type="text" value={formData.diagnosis} onChange={(e) => handleInputChange('diagnosis', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-bold focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none" placeholder="Tuliskan diagnosis..." />
                                </div>
                            </section>

                            {/* 5. Tatalaksana (Plan) */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-blue-600">
                                    <Pill size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wide">P - Plan (Tatalaksana)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Tindakan Medis</label>
                                        <textarea value={formData.tindakan} onChange={(e) => handleInputChange('tindakan', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none resize-none" placeholder="Tindakan yang dilakukan..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Resep Obat / Terapi</label>
                                        <textarea value={formData.resep_obat} onChange={(e) => handleInputChange('resep_obat', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none resize-none" placeholder="Daftar obat yang diberikan..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Edukasi / Catatan Tambahan</label>
                                    <input type="text" value={formData.catatan} onChange={(e) => handleInputChange('catatan', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-[#04989F]/20 focus:border-[#04989F] outline-none" placeholder="Catatan anjuran untuk pasien..." />
                                </div>
                            </section>
                            
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="text-xs text-slate-500 font-medium">
                                Kolom dengan <span className="text-rose-500">*</span> wajib diisi.
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSimpanRekamMedis}
                                    disabled={!formData.nama_pasien || !formData.diagnosis || !formData.keluhan_utama}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#04989F] hover:bg-[#037d83] shadow-sm shadow-[#04989F]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={16} />
                                    Simpan RME
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}</style>
        </AppLayout>
    );
}
