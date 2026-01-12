import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Heart,
    Volume2,
    VolumeX,
    Play,
    Pause,
    ChevronLeft,
    ChevronDown,
    Zap,
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
    ArrowLeft,
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

function getIcon(iconName: string): LucideIcon {
    return iconMap[iconName] || HelpCircle;
}

interface VideoFromDB {
    id: string;
    videoUrl: string;
    category: { id: string; name: string; slug: string; icon: string } | null;
}

interface CategoryFromDB {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

interface VideoData extends VideoFromDB {
    isLiked: boolean;
}

interface Props {
    category: CategoryFromDB | null;
    isPersonalized?: boolean;
    isLikedFeed?: boolean;
    videos: VideoFromDB[];
    likedVideoIds: string[];
}

const SingleVideo = ({
    video,
    isActive,
    isGlobalMuted,
    toggleGlobalMute,
    onToggleLike,
}: {
    video: VideoData;
    isActive: boolean;
    isGlobalMuted: boolean;
    toggleGlobalMute: () => void;
    onToggleLike: (id: string) => void;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showHeart, setShowHeart] = useState(false);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        if (isActive) {
            vid.currentTime = 0;
            vid.play().catch(() => {});
            setIsPlaying(true);
        } else {
            vid.pause();
            vid.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isActive]);

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const vid = videoRef.current;
        if (!vid) return;

        if (isPlaying) {
            vid.pause();
            setIsPlaying(false);
        } else {
            vid.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowHeart(true);
        if (!video.isLiked) onToggleLike(video.id);
        setTimeout(() => setShowHeart(false), 800);
    };

    return (
        <div className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-black touch-pan-y">
            <div
                className="relative w-full h-full lg:max-w-[450px] lg:h-[95vh] lg:rounded-2xl bg-zinc-900 overflow-hidden touch-pan-y select-none"
                onClick={togglePlay}
                onDoubleClick={handleDoubleClick}
            >
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full h-full object-cover touch-pan-y"
                    playsInline
                    loop
                    muted={!isActive || isGlobalMuted}
                />

                <AnimatePresence>
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm"
                            >
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showHeart && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -15 }}
                            animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, y: -100 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                        >
                            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-xl" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.visit(route("dashboard"));
                    }}
                    className="absolute top-6 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-40"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-40">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(video.id);
                        }}
                        className="flex flex-col items-center group"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                video.isLiked
                                    ? "bg-red-500 text-white"
                                    : "bg-black/40 text-white backdrop-blur-md"
                            }`}
                        >
                            <Heart
                                className={`w-6 h-6 ${
                                    video.isLiked ? "fill-current" : ""
                                } transition-transform group-active:scale-75`}
                            />
                        </div>
                        <span className="text-white text-xs mt-1 font-medium drop-shadow-md">
                            {video.isLiked ? "Beğenildi" : "Beğen"}
                        </span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleGlobalMute();
                        }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/50 transition-colors">
                            {isGlobalMuted ? (
                                <VolumeX className="w-6 h-6" />
                            ) : (
                                <Volume2 className="w-6 h-6" />
                            )}
                        </div>
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-30 pt-20">
                    {video.category && (
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                                {(() => {
                                    const Icon = getIcon(video.category.icon);
                                    return (
                                        <Icon className="w-3.5 h-3.5 text-beely-400" />
                                    );
                                })()}
                                <span className="text-white text-xs font-semibold">
                                    {video.category.name}
                                </span>
                            </div>
                        </div>
                    )}
                    <p className="text-white/70 text-sm">
                        Beely Önerilen İçerik
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function Feed({
    category,
    isPersonalized,
    isLikedFeed,
    videos: videosFromDB,
    likedVideoIds = [],
}: Props) {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== "undefined")
            return localStorage.getItem("beely-muted") === "true";
        return true;
    });

    useEffect(() => {
        localStorage.setItem("beely-muted", String(isMuted));
    }, [isMuted]);

    useEffect(() => {
        setVideos(
            videosFromDB.map((v) => ({
                ...v,
                isLiked: likedVideoIds.includes(v.id),
            }))
        );
    }, [videosFromDB, likedVideoIds]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(
                container.scrollTop / container.clientHeight
            );
            if (index !== activeIndex && index >= 0 && index < videos.length) {
                setActiveIndex(index);
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [activeIndex, videos.length]);

    const handleToggleLike = async (videoId: string) => {
        setVideos((prev) =>
            prev.map((v) =>
                v.id === videoId ? { ...v, isLiked: !v.isLiked } : v
            )
        );
        try {
            await axios.post(route("video.like", { video: videoId }));
        } catch {
            setVideos((prev) =>
                prev.map((v) =>
                    v.id === videoId ? { ...v, isLiked: !v.isLiked } : v
                )
            );
        }
    };

    const getTitle = () => {
        if (isLikedFeed) return "Beğenilenler";
        if (isPersonalized) return "Sana Özel";
        if (category) return category.name;
        return "Beely Feed";
    };

    if (videos.length === 0) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <p>Gösterilecek video yok.</p>
                    <button
                        onClick={() => router.visit(route("dashboard"))}
                        className="mt-4 px-4 py-2 bg-beely-500 rounded-full"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={getTitle()} />

            <div className="fixed inset-0 bg-black z-50 flex lg:justify-center">
                <div className="hidden lg:block absolute left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-900">
                    <AuthenticatedLayout hideHeader={true}>
                        <div />
                    </AuthenticatedLayout>
                </div>

                <div
                    ref={containerRef}
                    className="w-full lg:w-auto lg:flex-1 h-[100dvh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide focus:outline-none touch-pan-y"
                    style={{ scrollBehavior: "smooth" }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            containerRef.current?.scrollBy({
                                top: window.innerHeight,
                                behavior: "smooth",
                            });
                        }
                        if (e.key === "ArrowUp") {
                            e.preventDefault();
                            containerRef.current?.scrollBy({
                                top: -window.innerHeight,
                                behavior: "smooth",
                            });
                        }
                    }}
                >
                    {videos.map((video, index) => (
                        <SingleVideo
                            key={video.id}
                            video={video}
                            isActive={index === activeIndex}
                            isGlobalMuted={isMuted}
                            toggleGlobalMute={() => setIsMuted(!isMuted)}
                            onToggleLike={handleToggleLike}
                        />
                    ))}
                </div>

                <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4">
                    <button
                        onClick={() =>
                            containerRef.current?.scrollBy({
                                top: -window.innerHeight,
                                behavior: "smooth",
                            })
                        }
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-all"
                    >
                        <ChevronDown className="w-6 h-6 text-white rotate-180" />
                    </button>
                    <button
                        onClick={() =>
                            containerRef.current?.scrollBy({
                                top: window.innerHeight,
                                behavior: "smooth",
                            })
                        }
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-all"
                    >
                        <ChevronDown className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
