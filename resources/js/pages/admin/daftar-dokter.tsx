import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Admin', href: '/admin/daftar-dokter' }]}>
            <Head title="Manajeman dokter" />

            <div className="mx-auto w-full max-w-7xl p-8">
                <div className="rounded-2xl border border-teal-100 bg-white p-10 text-center shadow-sm">
                    <div className="mb-4 text-6xl">🚀</div>
                    <h1 className="mb-2 text-3xl font-extrabold text-teal-700">Manajemen Dokter.</h1>
                    <p className="text-lg font-medium text-slate-500">
                        Tambahin disini ada table terus ada imputan untuk nambahin dokter.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
