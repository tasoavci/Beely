import { Link, usePage, router } from "@inertiajs/react";
import {
    PropsWithChildren,
    ReactNode,
    useState,
    useRef,
    useEffect,
} from "react";
import {
    Hexagon,
    LayoutDashboard,
    MessageCircle,
    Grid3X3,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
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
};

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
}

interface SearchResult {
    type: "category" | "action";
    name: string;
    slug?: string;
    icon: LucideIcon;
    href: string;
}

export default function Authenticated({
    header,
    children,
    hideHeader = false,
}: PropsWithChildren<{ header?: ReactNode; hideHeader?: boolean }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const searchableItems: SearchResult[] = [
        {
            type: "action",
            name: "Beely ile Sohbet",
            icon: MessageCircle,
            href: route("chat"),
        },
        {
            type: "action",
            name: "Feed",
            icon: LayoutDashboard,
            href: route("feed"),
        },
        {
            type: "action",
            name: "Kategoriler",
            icon: Grid3X3,
            href: route("categories"),
        },
        {
            type: "category",
            name: "Motivasyon",
            slug: "motivasyon",
            icon: Zap,
            href: route("feed", { category: "motivasyon" }),
        },
        {
            type: "category",
            name: "Rahatlama",
            slug: "rahatlama",
            icon: Heart,
            href: route("feed", { category: "rahatlama" }),
        },
        {
            type: "category",
            name: "Eğlence",
            slug: "eglence",
            icon: Laugh,
            href: route("feed", { category: "eglence" }),
        },
        {
            type: "category",
            name: "Uyku",
            slug: "uyku",
            icon: Moon,
            href: route("feed", { category: "uyku" }),
        },
        {
            type: "category",
            name: "Odaklanma",
            slug: "odaklanma",
            icon: Target,
            href: route("feed", { category: "odaklanma" }),
        },
        {
            type: "category",
            name: "Meditasyon",
            slug: "meditasyon",
            icon: Sparkles,
            href: route("feed", { category: "meditasyon" }),
        },
        {
            type: "category",
            name: "Doğa",
            slug: "doga",
            icon: Leaf,
            href: route("feed", { category: "doga" }),
        },
        {
            type: "category",
            name: "Müzik",
            slug: "muzik",
            icon: Music,
            href: route("feed", { category: "muzik" }),
        },
        {
            type: "category",
            name: "Spor",
            slug: "spor",
            icon: Dumbbell,
            href: route("feed", { category: "spor" }),
        },
        {
            type: "category",
            name: "Öğrenme",
            slug: "ogrenme",
            icon: BookOpen,
            href: route("feed", { category: "ogrenme" }),
        },
        {
            type: "category",
            name: "İlham",
            slug: "ilham",
            icon: Lightbulb,
            href: route("feed", { category: "ilham" }),
        },
        {
            type: "category",
            name: "Stres Yönetimi",
            slug: "stres",
            icon: Wind,
            href: route("feed", { category: "stres" }),
        },
    ];

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const results = searchableItems.filter(
                (item) =>
                    item.name.toLowerCase().includes(query) ||
                    (item.slug && item.slug.toLowerCase().includes(query))
            );
            setSearchResults(results.slice(0, 6));
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSelect = (result: SearchResult) => {
        router.visit(result.href);
        setSearchQuery("");
        setShowSearchResults(false);
    };

    const navigation: NavItem[] = [
        {
            name: "Feed",
            href: route("dashboard"),
            icon: LayoutDashboard,
            current: route().current("dashboard"),
        },
        {
            name: "Beely ile Sohbet",
            href: route("chat"),
            icon: MessageCircle,
            current: route().current("chat"),
        },
        {
            name: "Kategoriler",
            href: route("categories"),
            icon: Grid3X3,
            current: route().current("categories"),
        },
        {
            name: "Beğenilenler",
            href: route("liked-videos"),
            icon: Heart,
            current: route().current("liked-videos"),
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
                    >
                        <SidebarContent
                            navigation={navigation}
                            user={user}
                            onClose={() => setSidebarOpen(false)}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
                <SidebarContent navigation={navigation} user={user} />
            </aside>

            <div className="lg:pl-72">
                {/* Top header */}
                {!hideHeader && (
                    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900/80">
                        <button
                            type="button"
                            className="lg:hidden -m-2.5 p-2.5 text-zinc-700 dark:text-zinc-300"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex flex-1 gap-4" ref={searchRef}>
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() =>
                                        searchQuery &&
                                        setShowSearchResults(true)
                                    }
                                    placeholder="Kategori veya sayfa ara..."
                                    className="w-full h-10 pl-10 pr-4 rounded-xl border-0 bg-zinc-100 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-beely-500 dark:bg-zinc-800 dark:text-zinc-100"
                                />

                                <AnimatePresence>
                                    {showSearchResults &&
                                        searchResults.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
                                            >
                                                {searchResults.map(
                                                    (result, index) => (
                                                        <button
                                                            key={`${result.type}-${result.name}`}
                                                            onClick={() =>
                                                                handleSearchSelect(
                                                                    result
                                                                )
                                                            }
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                                                        >
                                                            <div
                                                                className={`p-2 rounded-lg ${
                                                                    result.type ===
                                                                    "action"
                                                                        ? "bg-beely-100 dark:bg-beely-900/30 text-beely-600 dark:text-beely-400"
                                                                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                                                                }`}
                                                            >
                                                                <result.icon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                                    {
                                                                        result.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-zinc-500">
                                                                    {result.type ===
                                                                    "action"
                                                                        ? "Sayfa"
                                                                        : "Kategori"}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                {/* No results */}
                                <AnimatePresence>
                                    {showSearchResults &&
                                        searchQuery &&
                                        searchResults.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-4 z-50"
                                            >
                                                <p className="text-sm text-zinc-500 text-center">
                                                    Sonuç bulunamadı
                                                </p>
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center gap-3">
                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden"
                                            >
                                                <div className="p-3 border-b border-zinc-100 dark:border-zinc-700">
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="p-1">
                                                    <Link
                                                        href={route(
                                                            "profile.edit"
                                                        )}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                                        onClick={() =>
                                                            setUserMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <User className="h-4 w-4" />
                                                        Profil
                                                    </Link>
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        onClick={() =>
                                                            setUserMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Çıkış Yap
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </header>
                )}

                {/* Page header */}
                {header && (
                    <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                )}

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

function SidebarContent({
    navigation,
    user,
    onClose,
}: {
    navigation: NavItem[];
    user: { name: string; email: string };
    onClose?: () => void;
}) {
    return (
        <div className="flex h-full flex-col bg-zinc-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
                <Link
                    href={route("dashboard")}
                    className="flex items-center gap-2"
                >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center">
                        <Hexagon className="h-5 w-5 fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Beely
                    </span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 -mr-1.5 text-zinc-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    item.current
                                        ? "bg-beely-500 text-white shadow-lg shadow-beely-500/25"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                }`}
                                onClick={onClose}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-zinc-800">
                {/* User info */}
                <div className="flex items-center gap-3 p-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
