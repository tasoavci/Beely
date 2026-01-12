import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Grid3X3, Trash2, Plus, ChevronLeft, Search, X } from "lucide-react";
import { useState, useRef } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    videos_count: number;
    created_at: string;
}

interface Props {
    categories?: {
        data: Category[];
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

const iconOptions = [
    "Zap",
    "Heart",
    "Laugh",
    "Moon",
    "Target",
    "Sparkles",
    "Leaf",
    "Music",
    "Dumbbell",
    "BookOpen",
    "Lightbulb",
    "Wind",
];

export default function AdminCategories({ categories = { data: [] }, filters = {} }: Props) {
    const [showAddModal, setShowAddModal] = useState(false);
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
                route("admin.categories.index"),
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
        router.get(route("admin.categories.index"), {}, { preserveState: true, replace: true });
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        slug: "",
        icon: "Zap",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.categories.store"), {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    const handleDelete = (categoryId: string) => {
        if (confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
            setDeletingId(categoryId);
            router.delete(route("admin.categories.destroy", categoryId), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kategoriler - Admin" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.index")}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                Kategoriler
                            </h1>
                            <p className="text-zinc-500 mt-1">
                                Toplam{" "}
                                {(categories as any)?.total ||
                                    categories?.meta?.total ||
                                    categories?.data?.length ||
                                    0}{" "}
                                kategori
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-beely-500 text-white rounded-lg hover:bg-beely-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Kategori Ekle
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Kategori adı veya slug ile ara..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(categories?.data || []).map((category) => (
                        <div
                            key={category.id}
                            className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 hover:border-beely-500 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-beely-100 dark:bg-beely-900/30 rounded-xl">
                                        <Grid3X3 className="h-6 w-6 text-beely-600 dark:text-beely-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            {category.slug}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    disabled={deletingId === category.id}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                    title="Sil"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                {category.videos_count} video
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {categories?.links && categories.links.length > 3 && (
                    <div className="mt-6 px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-white dark:bg-zinc-800 rounded-2xl">
                        <div className="text-sm text-zinc-500">
                            Sayfa {categories?.meta?.current_page || 1} / {categories?.meta?.last_page || 1}
                        </div>
                        <div className="flex gap-2">
                            {categories.links.map((link: any, index: number) => (
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

                {/* Add Category Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Yeni Kategori Ekle
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Kategori Adı
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData("name", e.target.value);
                                            setData(
                                                "slug",
                                                generateSlug(e.target.value)
                                            );
                                        }}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                                        placeholder="Örn: Motivasyon"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                                        placeholder="motivasyon"
                                        required
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        İkon
                                    </label>
                                    <select
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData("icon", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                                        required
                                    >
                                        {iconOptions.map((icon) => (
                                            <option key={icon} value={icon}>
                                                {icon}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.icon && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            reset();
                                        }}
                                        className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-beely-500 text-white rounded-lg hover:bg-beely-600 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? "Ekleniyor..." : "Ekle"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

