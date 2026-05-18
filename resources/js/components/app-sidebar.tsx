import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react'; // Tambahkan usePage
import { Calendar, FileText, FolderOpen, LayoutGrid, ListOrdered, Pill, PillIcon, Stethoscope, UserPlus } from 'lucide-react'; // Tambahkan icon baru
import AppLogo from './app-logo';

export function AppSidebar() {
    // 1. Ambil data auth dari Inertia
    const { auth } = usePage().props as any;
    const userRole = auth.user.role; // 'admin' atau 'dokter'

    // 2. Menu Khusus Dokter
    const dokterNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Antrian',
            url: '/antrian',
            icon: ListOrdered,
        },
        {
            title: 'Hasil Pemeriksaan',
            url: '/diagnosis',
            icon: FileText,
        },
        {
            title: 'Resep Obat',
            url: '/resep-obat',
            icon: Pill,
        },
        {
            title: 'Rekam Medis',
            url: '/rekam-medis',
            icon: FolderOpen,
        },
        {
            title: 'Jadwal Praktek',
            url: '/jadwal-praktek',
            icon: Calendar,
        },
    ];

    // 3. Menu Khusus Admin
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kelola Dokter',
            url: '/admin/dokter',
            icon: Stethoscope,
        },
        {
            title: 'Pendaftaran',
            url: '/admin/pendaftaran',
            icon: UserPlus,
        },
        {
            title: 'Daftar Obat',
            url: '/admin/daftar-obat',
            icon: PillIcon,
        },
    ];

    // 4. Tentukan menu dan URL logo berdasarkan Role
    const mainNavItems = userRole === 'admin' ? adminNavItems : dokterNavItems;
    const dashboardUrl = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* URL Logo juga disesuaikan agar admin kembali ke /admin/dashboard */}
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 5. Render menu yang terpilih */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
