import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Video,
    Trash2,
    Plus,
    ChevronLeft,
    Search,
    X,
    AlertTriangle,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

interface VideoItem {
    id: string;
    video_url: string;
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
    created_at: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Props {
    videos?: {
        data: VideoItem[];
        links?: any;
        meta?: {
            total?: number;
            current_page?: number;
            last_page?: number;
        };
    };
    categories?: Category[];
    filters?: {
        search?: string;
    };
}

export default function AdminVideos({
    videos = { data: [] },
    categories = [],
    filters = {},
}: Props) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
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
                route("admin.videos.index"),
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
        router.get(
            route("admin.videos.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        video_url: "",
        category_id: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.videos.store"), {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    const handleDeleteClick = (videoId: string) => {
        setVideoToDelete(videoId);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (videoToDelete) {
            setDeletingId(videoToDelete);
            router.delete(route("admin.videos.destroy", videoToDelete), {
                onFinish: () => {
                    setDeletingId(null);
                    setShowDeleteDialog(false);
                    setVideoToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Videolar - Admin" />

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
                                Videolar
                            </h1>
                            <p className="text-zinc-500 mt-1">
                                Toplam{" "}
                                {(videos as any)?.total ||
                                    videos?.meta?.total ||
                                    videos?.data?.length ||
                                    0}{" "}
                                video
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-beely-500 text-white rounded-lg hover:bg-beely-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Video Ekle
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
                            placeholder="Video URL veya kategori ile ara..."
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
                                        Video URL
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Eklenme Tarihi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                {(videos?.data || []).map((video) => (
                                    <tr
                                        key={video.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <a
                                                href={video.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-beely-600 dark:text-beely-400 hover:underline truncate max-w-md block"
                                            >
                                                {video.video_url}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {video.category ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 rounded-full">
                                                    {video.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-zinc-400">
                                                    Kategori yok
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                                            {new Date(
                                                video.created_at
                                            ).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(video.id)
                                                }
                                                disabled={
                                                    deletingId === video.id
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Sil"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {videos?.links && videos.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                            <div className="text-sm text-zinc-500">
                                Sayfa {videos?.meta?.current_page || 1} /{" "}
                                {videos?.meta?.last_page || 1}
                            </div>
                            <div className="flex gap-2">
                                {videos.links.map(
                                    (link: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-3 py-1 rounded-lg text-sm ${
                                                link.active
                                                    ? "bg-beely-500 text-white"
                                                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                                            } ${
                                                !link.url
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Video Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Yeni Video Ekle
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Video URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.video_url}
                                        onChange={(e) =>
                                            setData("video_url", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                                        placeholder="https://..."
                                        required
                                    />
                                    {errors.video_url && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.video_url}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Kategori Seçin</option>
                                        {(categories || []).map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.category_id}
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <AlertDialogTitle>Videoyu Sil</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            Bu videoyu silmek istediğinize emin misiniz? Bu
                            işlem geri alınamaz ve video kalıcı olarak
                            silinecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
