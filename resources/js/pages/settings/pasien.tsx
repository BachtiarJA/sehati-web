import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Pill, Filter, Download } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pasien',
        href: '/pasien',
    },
];

interface Pasien {
  id_akun: string;
  id_pasien: string;
  nama: string;
  alamat: string;
  jenis_kelamin: string;
  umur: number;
  status: 'Aktif' | 'Nonaktif';
}

const DUMMY_DATA: Pasien[] = [
  { id_akun: 'AKN-001', id_pasien: 'PSN-001', nama: 'Budi Santoso', alamat: 'Jl. Merdeka No. 12', jenis_kelamin: 'Laki-laki', umur: 45, status: 'Aktif' },
  { id_akun: 'AKN-002', id_pasien: 'PSN-002', nama: 'Siti Aminah', alamat: 'Jl. Sudirman No. 8', jenis_kelamin: 'Perempuan', umur: 32, status: 'Aktif' },
  { id_akun: 'AKN-003', id_pasien: 'PSN-003', nama: 'Ahmad Dahlan', alamat: 'Jl. Diponegoro No. 45', jenis_kelamin: 'Laki-laki', umur: 28, status: 'Aktif' },
  { id_akun: 'AKN-004', id_pasien: 'PSN-004', nama: 'Rina Wijaya', alamat: 'Jl. Kartini No. 21', jenis_kelamin: 'Perempuan', umur: 50, status: 'Nonaktif' },
  { id_akun: 'AKN-005', id_pasien: 'PSN-005', nama: 'Dewi Lestari', alamat: 'Jl. Pattimura No. 9', jenis_kelamin: 'Perempuan', umur: 24, status: 'Aktif' },
];

export default function Pasien() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleBeriObat = (idPasien: string, namaPasien: string) => {
    router.visit(`/resep-obat?pasien=${idPasien}&nama=${encodeURIComponent(namaPasien)}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Pasien" />
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full font-sans">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Manajemen Pasien 🩺</h1>
            <p className="text-slate-500 mt-1">Kelola data pasien dan berikan resep dengan mudah.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium w-full sm:w-auto">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20 text-sm font-medium w-full sm:w-auto transform hover:-translate-y-0.5">
              <Plus size={16} />
              Tambah Pasien
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari ID, Nama pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table Data */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 p-2 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">ID Akun</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">ID Pasien</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">Nama Pasien</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">Alamat</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">L/P</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider">Umur</th>
                  <th className="pb-4 pt-2 px-6 font-semibold text-slate-500 text-sm tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_DATA.map((pasien, index) => (
                  <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">{pasien.id_akun}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md">{pasien.id_pasien}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{pasien.nama}</div>
                      <div className="text-xs font-medium text-slate-400 mt-0.5">{pasien.status}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600 dark:text-slate-400 max-w-[150px] truncate" title={pasien.alamat}>{pasien.alamat}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">{pasien.jenis_kelamin}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">{pasien.umur} Thn</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleBeriObat(pasien.id_pasien, pasien.nama)}
                          className="p-1.5 text-teal-600 bg-teal-50 hover:bg-teal-100 dark:text-teal-400 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 rounded-lg transition-colors border border-teal-200/50 dark:border-teal-500/20"
                          title="Beri Resep Obat"
                        >
                          <Pill size={16} />
                        </button>
                        <button className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-200/50 dark:border-blue-500/20" title="Edit Data">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-200/50 dark:border-rose-500/20" title="Hapus Data">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {DUMMY_DATA.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-base font-medium text-slate-600 dark:text-slate-400">Tidak ada data pasien</p>
                        <p className="text-sm">Tambahkan pasien baru atau ubah kata kunci pencarian.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4 px-2">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">1</span> sampai <span className="font-semibold text-slate-700 dark:text-slate-300">{DUMMY_DATA.length}</span> dari <span className="font-semibold text-slate-700 dark:text-slate-300">{DUMMY_DATA.length}</span> pasien
            </p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-lg bg-white dark:bg-slate-800 cursor-not-allowed text-sm font-medium">Sebelumnya</button>
              <button className="px-3 py-1.5 border border-emerald-500 text-white rounded-lg bg-emerald-500 text-sm font-bold shadow-sm shadow-emerald-500/20">1</button>
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm font-medium">Selanjutnya</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
