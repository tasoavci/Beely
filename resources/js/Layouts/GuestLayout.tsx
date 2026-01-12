import { PropsWithChildren, ReactNode } from "react";
import { Hexagon } from "lucide-react";
import { motion } from "framer-motion";

export default function GuestLayout({
    children,
    title,
    subtitle,
}: PropsWithChildren<{ title: string; subtitle?: ReactNode }>) {
    const bees = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col lg:flex-row overflow-hidden">
            <div className="relative w-full lg:w-[45%] bg-beely-950 text-white flex flex-col justify-center items-center p-8 overflow-hidden order-first">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-beely-900/20 via-zinc-950 to-zinc-950" />

                {bees.map((bee) => (
                    <motion.div
                        key={bee.id}
                        className="absolute text-beely-500/20"
                        initial={{ x: `${bee.x}%`, y: `${bee.y}%`, opacity: 0 }}
                        animate={{
                            x: [
                                `${bee.x}%`,
                                `${(bee.x + 20) % 100}%`,
                                `${(bee.x - 20) % 100}%`,
                            ],
                            y: [
                                `${bee.y}%`,
                                `${(bee.y - 30) % 100}%`,
                                `${(bee.y + 30) % 100}%`,
                            ],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: bee.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: bee.delay,
                        }}
                    >
                        <Hexagon
                            size={40 + Math.random() * 40}
                            fill="currentColor"
                        />
                    </motion.div>
                ))}

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 relative flex flex-col items-center"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="mb-6 bg-beely-500/10 p-6 rounded-full ring-1 ring-beely-500/50 backdrop-blur-sm"
                    >
                        <Hexagon
                            size={64}
                            className="text-beely-500 fill-beely-500"
                        />
                    </motion.div>

                    <h1 className="text-4xl font-bold tracking-tighter">
                        Beely.
                    </h1>
                    <p className="mt-2 text-zinc-400 text-center max-w-sm">
                        Moduna göre içerik, arı gibi çalışan asistan.
                    </p>
                </motion.div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative">
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md space-y-6"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-zinc-500 dark:text-zinc-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 backdrop-blur-xl">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
