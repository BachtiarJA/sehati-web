import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Search, Edit2, Trash2, Filter, Download, X, Save, FileText } from 'lucide-react';

interface Pemeriksaan {
    id_pemeriksaan: string;
    id_antrian: string;
    keluhan: string;
    diagnosa: string;
    tindakan: string;
}

const INITIAL_DATA: Pemeriksaan[] = [
    { id_pemeriksaan: 'PMR-001', id_antrian: 'A01', keluhan: 'Pusing, mual sejak 3 hari lalu', diagnosa: 'Vertigo & Dispepsia', tindakan: 'Pemberian obat anti-mual & edukasi diet' },
    { id_pemeriksaan: 'PMR-002', id_antrian: 'B02', keluhan: 'Sakit gigi bagian bawah kiri', diagnosa: 'Karies dentis', tindakan: 'Tambal sementara' },
    { id_pemeriksaan: 'PMR-003', id_antrian: 'C03', keluhan: 'Demam tinggi, ruam merah', diagnosa: 'Suspek DBD', tindakan: 'Rujuk untuk cek darah lengkap' },
];

export default function Pemeriksaan() {
    const [searchTerm, setSearchTerm] = useState('');
    const [pemeriksaanData, setPemeriksaanData] = useState<Pemeriksaan[]>(INITIAL_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<Pemeriksaan>({
        id_pemeriksaan: '',
        id_antrian: '',
        keluhan: '',
        diagnosa: '',
        tindakan: '',
    });

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            id_pemeriksaan: '',
            id_antrian: '',
            keluhan: '',
            diagnosa: '',
            tindakan: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (pemeriksaan: Pemeriksaan) => {
        setModalMode('edit');
        setFormData(pemeriksaan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setPemeriksaanData([...pemeriksaanData, formData]);
        } else {
            setPemeriksaanData(pemeriksaanData.map(p => p.id_pemeriksaan === formData.id_pemeriksaan ? formData : p));
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id_pemeriksaan: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
            setPemeriksaanData(pemeriksaanData.filter(p => p.id_pemeriksaan !== id_pemeriksaan));
        }
    };

    const filteredData = pemeriksaanData.filter(p =>
        p.id_pemeriksaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id_antrian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.keluhan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari ID, Antrian, Diagnosa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm bg-white transition-all shadow-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto">
                            <Download size={16} />
                            Export
                        </button>
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20 text-sm font-medium w-full sm:w-auto"
                        >
                            <Plus size={16} />
                            Input Hasil
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Pemeriksaan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Antrian</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Keluhan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Diagnosa</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Tindakan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">{item.id_pemeriksaan}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">{item.id_antrian}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-[200px] truncate" title={item.keluhan}>{item.keluhan}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-[200px] truncate" title={item.diagnosa}>{item.diagnosa}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-[200px] truncate" title={item.tindakan}>{item.tindakan}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors border border-blue-200/50"
                                                    title="Edit Hasil"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id_pemeriksaan)}
                                                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors border border-rose-200/50"
                                                    title="Hapus Hasil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Search size={48} className="mb-4 text-slate-300" />
                                                <p className="text-base font-medium text-slate-600">Tidak ada data pemeriksaan</p>
                                                <p className="text-sm">Tambahkan hasil pemeriksaan baru atau ubah kata kunci pencarian.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                            Menampilkan <span className="font-bold text-slate-700">{filteredData.length > 0 ? 1 : 0}</span> sampai <span className="font-bold text-slate-700">{filteredData.length}</span> dari <span className="font-bold text-slate-700">{pemeriksaanData.length}</span> hasil
                        </p>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1.5 border border-slate-200 text-slate-400 rounded-lg bg-white cursor-not-allowed text-sm font-medium">Sebelumnya</button>
                            <button className="px-3 py-1.5 border border-emerald-500 text-white rounded-lg bg-emerald-500 text-sm font-bold shadow-sm shadow-emerald-500/20">1</button>
                            <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium">Selanjutnya</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">
                                {modalMode === 'add' ? 'Input Hasil Pemeriksaan' : 'Edit Hasil Pemeriksaan'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">ID Pemeriksaan</label>
                                    <input
                                        type="text"
                                        name="id_pemeriksaan"
                                        required
                                        value={formData.id_pemeriksaan}
                                        onChange={handleInputChange}
                                        readOnly={modalMode === 'edit'}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 ${modalMode === 'edit' ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-800'
                                            }`}
                                        placeholder="Contoh: PMR-001"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">No. Antrian</label>
                                    <input
                                        type="text"
                                        name="id_antrian"
                                        required
                                        value={formData.id_antrian}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                                        placeholder="Contoh: A01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Keluhan Pasien</label>
                                <textarea
                                    name="keluhan"
                                    required
                                    value={formData.keluhan}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none"
                                    placeholder="Keluhan utama..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Diagnosa</label>
                                <textarea
                                    name="diagnosa"
                                    required
                                    value={formData.diagnosa}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none"
                                    placeholder="Hasil diagnosa dokter..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Tindakan</label>
                                <textarea
                                    name="tindakan"
                                    required
                                    value={formData.tindakan}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none"
                                    placeholder="Tindakan yang diberikan..."
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
                                >
                                    <Save size={16} />
                                    {modalMode === 'add' ? 'Simpan Data' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
