import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Sparkles, Play, ChevronRight, Hexagon, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Ana Sayfa - Beely" />

            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
                {/* Beely Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-beely-500 via-beely-600 to-amber-600 p-8 sm:p-10 text-white text-center"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-beely-400/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        {/* Animated Beely icon */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
                        >
                            <Hexagon className="h-10 w-10 fill-current" />
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                            Hoş geldin, {user.name.split(" ")[0]}!
                        </h1>
                        <p className="text-beely-100 text-base sm:text-lg max-w-md mx-auto mb-8">
                            Bugün nasıl hissediyorsun? Beely ile sohbet ederek
                            ruh haline uygun içerikler keşfet.
                        </p>

                        <Link
                            href={route("chat")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-base font-medium transition-all duration-200 hover:scale-105"
                        >
                            <Sparkles className="h-5 w-5" />
                            Beely ile Sohbet Et
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>
                </motion.div>

                {/* Separator */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.15 }}
                    className="w-full max-w-xs my-8 flex items-center gap-4"
                >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                        ya da
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
                </motion.div>

                {/* Feed'e Gir Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href={route("feed")}
                        className="group flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-beely-500/30 rounded-full blur-xl"
                            />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center shadow-2xl shadow-beely-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Play className="h-10 w-10 text-white ml-1" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-beely-600 transition-colors">
                                Feed'e Gir
                            </p>
                            <div className="flex items-center gap-1.5 justify-center mt-1">
                                <Shuffle className="h-3.5 w-3.5 text-zinc-400" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Rastgele videolar izlemeye başla
                                </p>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
