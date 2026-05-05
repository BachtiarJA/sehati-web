import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Admin', href: '/admin/pendaftaran-pasien' }]}>
            <Head title="Manajeman dokter" />

            <div className="mx-auto w-full max-w-7xl p-8">
                <div className="rounded-2xl border border-teal-100 bg-white p-10 text-center shadow-sm">
                    <div className="mb-4 text-6xl">🚀</div>
                    <h1 className="mb-2 text-3xl font-extrabold text-teal-700">Manajemen pasien.</h1>
                    <p className="text-lg font-medium text-slate-500">
                        Tambahin sama kek manajeman dokter cuman tambah untuk antrian.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
