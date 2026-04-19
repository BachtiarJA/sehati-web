import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Antrian',
        href: '/antrian',
    },
];



export default function Dashboard() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Antrian" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

            </div>
        </AppLayout>
    );
}
