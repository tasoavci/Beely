import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Users, Trash2, CheckCircle, XCircle, ChevronLeft, Search, X } from "lucide-react";
import { useState, useRef } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface Props {
    users?: {
        data: User[];
        links?: any;
        meta?: {
            total?: number;
            current_page?: number;
            last_page?: number;
        };
    };
    filters?: {
        search?: string;
    };
}

export default function AdminUsers({ users = { data: [] }, filters = {} }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [search, setSearch] = useState(filters?.search || "");
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            router.get(
                route("admin.users.index"),
                { search: value || undefined },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300);
    };

    const clearSearch = () => {
        setSearch("");
        router.get(route("admin.users.index"), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (userId: string) => {
        if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            setDeletingId(userId);
            router.delete(route("admin.users.destroy", userId), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const handleVerifyEmail = (userId: string) => {
        router.post(route("admin.users.verify-email", userId));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kullanıcılar - Admin" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href={route("admin.index")}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            Kullanıcılar
                        </h1>
                        <p className="text-zinc-500 mt-1">
                            Toplam{" "}
                            {(users as any)?.total ||
                                users?.meta?.total ||
                                users?.data?.length ||
                                0}{" "}
                            kullanıcı
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="İsim veya email ile ara..."
                            className="w-full pl-10 pr-10 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                            >
                                <X className="h-4 w-4 text-zinc-400" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-50 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Kayıt Tarihi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                {(users?.data || []).map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.role === "admin"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300"
                                                }`}
                                            >
                                                {user.role === "admin"
                                                    ? "Admin"
                                                    : "Kullanıcı"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email_verified_at ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Doğrulanmış
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                                                    <XCircle className="h-4 w-4" />
                                                    Doğrulanmamış
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                                            {new Date(user.created_at).toLocaleDateString(
                                                "tr-TR"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.email_verified_at && (
                                                    <button
                                                        onClick={() =>
                                                            handleVerifyEmail(user.id)
                                                        }
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Email Doğrula"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users?.links && users.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                            <div className="text-sm text-zinc-500">
                                Sayfa {users?.meta?.current_page || 1} / {users?.meta?.last_page || 1}
                            </div>
                            <div className="flex gap-2">
                                {users.links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-1 rounded-lg text-sm ${
                                            link.active
                                                ? "bg-beely-500 text-white"
                                                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

