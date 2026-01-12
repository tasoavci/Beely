import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Users, Video, Grid3X3, LayoutDashboard } from "lucide-react";

export default function AdminIndex() {
    const menuItems = [
        {
            name: "Kullanıcılar",
            href: route("admin.users.index"),
            icon: Users,
            description: "Kullanıcıları görüntüle, sil ve email doğrula",
        },
        {
            name: "Videolar",
            href: route("admin.videos.index"),
            icon: Video,
            description: "Video ekle, sil ve kategorilere ata",
        },
        {
            name: "Kategoriler",
            href: route("admin.categories.index"),
            icon: Grid3X3,
            description: "Kategori ekle ve sil",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Paneli" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        Admin Paneli
                    </h1>
                    <p className="text-zinc-500 mt-2">
                        Uygulama yönetimi için admin paneline hoş geldiniz
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-beely-500 dark:hover:border-beely-500 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-beely-100 dark:bg-beely-900/30 rounded-xl group-hover:bg-beely-500 group-hover:text-white transition-colors">
                                        <Icon className="h-6 w-6 text-beely-600 dark:text-beely-400 group-hover:text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                        {item.name}
                                    </h2>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {item.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
