import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Zap,
    Heart,
    Laugh,
    Moon,
    Target,
    Sparkles,
    Leaf,
    Music,
    Dumbbell,
    BookOpen,
    Lightbulb,
    Wind,
    HelpCircle,
    Play,
    Check,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryFromDB {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string | null;
}

interface Props {
    categories: CategoryFromDB[];
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Zap: Zap,
    Heart: Heart,
    Laugh: Laugh,
    Moon: Moon,
    Target: Target,
    Sparkles: Sparkles,
    Leaf: Leaf,
    Music: Music,
    Dumbbell: Dumbbell,
    BookOpen: BookOpen,
    Lightbulb: Lightbulb,
    Wind: Wind,
};

// Gradient mapping
const gradientMap: Record<string, string> = {
    motivasyon: "from-orange-500 to-amber-600",
    rahatlama: "from-rose-500 to-pink-600",
    eglence: "from-yellow-500 to-orange-500",
    uyku: "from-indigo-500 to-purple-600",
    odaklanma: "from-blue-500 to-cyan-600",
    meditasyon: "from-violet-500 to-indigo-600",
    doga: "from-green-500 to-emerald-600",
    muzik: "from-purple-500 to-violet-600",
    spor: "from-red-500 to-rose-600",
    ogrenme: "from-teal-500 to-emerald-600",
    ilham: "from-amber-500 to-yellow-500",
    stres: "from-sky-500 to-blue-600",
};

function getIcon(iconName: string): LucideIcon {
    return iconMap[iconName] || HelpCircle;
}

function getGradient(slug: string): string {
    return gradientMap[slug] || "from-gray-500 to-slate-600";
}

export default function Categories({ categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            setSelectedCategories(selectedCategories.filter((s) => s !== slug));
        } else if (selectedCategories.length < 3) {
            setSelectedCategories([...selectedCategories, slug]);
        }
    };

    const goToPersonalizedFeed = () => {
        if (selectedCategories.length > 0) {
            const slugs = selectedCategories.join(",");
            router.visit(
                route("feed", { category: "sana-ozel", categories: slugs })
            );
        }
    };

    const openModal = () => {
        setSelectedCategories([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategories([]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kategoriler - Beely" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Sana Özel Button */}
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={openModal}
                    className="w-full py-4 bg-gradient-to-r from-beely-500 via-amber-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                >
                    <Sparkles className="h-6 w-6" />
                    Kendine Özel Ayarla
                </motion.button>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Selection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-beely-500 via-amber-500 to-orange-500 rounded-xl">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                                Sana Özel Mix
                                            </h2>
                                            <p className="text-sm text-zinc-500">
                                                En fazla 3 kategori seç
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Selected Categories */}
                                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-3 rounded-full transition-all ${
                                                        i <
                                                        selectedCategories.length
                                                            ? "bg-beely-500 scale-110"
                                                            : "bg-zinc-300 dark:bg-zinc-600"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-zinc-500">
                                            {selectedCategories.length}/3
                                            seçildi
                                        </span>
                                    </div>
                                    {selectedCategories.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategories.map((slug) => {
                                                const cat = categories.find(
                                                    (c) => c.slug === slug
                                                );
                                                if (!cat) return null;
                                                const IconComponent = getIcon(
                                                    cat.icon
                                                );
                                                const gradient = getGradient(
                                                    cat.slug
                                                );
                                                return (
                                                    <motion.button
                                                        key={slug}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        onClick={() =>
                                                            toggleCategory(slug)
                                                        }
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${gradient} text-white text-sm font-medium rounded-full shadow-md hover:scale-105 transition-transform`}
                                                    >
                                                        <IconComponent className="h-4 w-4" />
                                                        {cat.name}
                                                        <X className="h-3.5 w-3.5 ml-0.5" />
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-zinc-400">
                                            Aşağıdan kategori seçmeye başla...
                                        </p>
                                    )}
                                </div>

                                {/* Category Grid in Modal */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {categories.map((category) => {
                                            const IconComponent = getIcon(
                                                category.icon
                                            );
                                            const gradient = getGradient(
                                                category.slug
                                            );
                                            const isSelected =
                                                selectedCategories.includes(
                                                    category.slug
                                                );
                                            const canSelect =
                                                selectedCategories.length < 3;

                                            return (
                                                <motion.button
                                                    key={category.id}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        if (
                                                            isSelected ||
                                                            canSelect
                                                        ) {
                                                            toggleCategory(
                                                                category.slug
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        !isSelected &&
                                                        !canSelect
                                                    }
                                                    className={`relative p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                                                        isSelected
                                                            ? `bg-gradient-to-br ${gradient} text-white shadow-lg scale-105`
                                                            : canSelect
                                                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-1 right-1 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                    <IconComponent className="h-7 w-7" />
                                                    <span className="text-xs font-medium text-center">
                                                        {category.name}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                    <button
                                        onClick={goToPersonalizedFeed}
                                        disabled={
                                            selectedCategories.length === 0
                                        }
                                        className={`w-full py-3.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                                            selectedCategories.length > 0
                                                ? "bg-gradient-to-r from-beely-500 via-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                        }`}
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        {selectedCategories.length > 0
                                            ? "Sana Özel Feed'e Gir"
                                            : "Kategori Seç"}
                                        {selectedCategories.length > 0 && (
                                            <Play className="h-4 w-4 ml-1" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}

function CategoryCard({
    category,
    index,
}: {
    category: CategoryFromDB;
    index: number;
}) {
    const IconComponent = getIcon(category.icon);
    const gradient = getGradient(category.slug);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
        >
            <Link
                href={route("feed", { category: category.slug })}
                className="group relative block overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
                {/* Background gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-110`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <IconComponent className="h-10 w-10 sm:h-12 sm:w-12 mb-3 drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-bold text-center drop-shadow-lg">
                        {category.name}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );
}
