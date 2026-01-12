import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import {
    Heart,
    Play,
    Trash2,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Icon mapping
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
    category: {
        id: string;
        name: string;
        slug: string;
        icon: string;
    } | null;
    likedAt: string;
}

interface Props {
    videos: VideoFromDB[];
}

export default function LikedVideos({ videos: initialVideos }: Props) {
    const [videos, setVideos] = useState(initialVideos);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    const handleUnlike = async (videoId: string) => {
        // Optimistic update
        setVideos((prev) => prev.filter((v) => v.id !== videoId));

        try {
            await axios.post(route("video.like", { video: videoId }));
        } catch (error) {
            // Revert on error - refetch
            router.reload();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Beğenilen Videolar - Beely" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                        <Heart className="h-7 w-7 text-red-500 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            Beğenilen Videolar
                        </h1>
                        <p className="text-zinc-500 mt-0.5">
                            {videos.length} video beğendin
                        </p>
                    </div>
                </div>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence mode="popLayout">
                            {videos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900"
                                >
                                    {/* Video Preview */}
                                    <video
                                        src={video.videoUrl}
                                        className="w-full h-full object-cover"
                                        loop
                                        muted
                                        playsInline
                                        onMouseEnter={(e) => {
                                            e.currentTarget.play();
                                            setPlayingVideo(video.id);
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                            setPlayingVideo(null);
                                        }}
                                    />

                                    {/* Overlay */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity ${
                                            playingVideo === video.id
                                                ? "opacity-50"
                                                : "opacity-100"
                                        }`}
                                    />

                                    {/* Play icon */}
                                    {playingVideo !== video.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <Play className="h-6 w-6 text-white ml-0.5" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Category badge */}
                                    {video.category && (
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                                                {(() => {
                                                    const IconComponent = getIcon(
                                                        video.category.icon
                                                    );
                                                    return (
                                                        <IconComponent className="h-3 w-3" />
                                                    );
                                                })()}
                                                {video.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Unlike button - z-index higher than overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnlike(video.id);
                                        }}
                                        className="absolute top-2 right-2 p-2.5 bg-red-500 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-600 transition-all z-20 shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Bottom info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                        <p className="text-white/60 text-xs">
                                            {formatDate(video.likedAt)}
                                        </p>
                                    </div>

                                    {/* Click to play - lower z-index */}
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route("feed", {
                                                    category: "liked",
                                                })
                                            )
                                        }
                                        className="absolute inset-0 z-0"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <Heart className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                            Henüz video beğenmedin
                        </p>
                        <p className="text-zinc-500 mt-1 max-w-sm">
                            Feed'de gezinirken beğendiğin videolar burada görünecek
                        </p>
                        <button
                            onClick={() => router.visit(route("feed"))}
                            className="mt-6 px-8 py-3 bg-beely-500 text-white rounded-xl font-medium hover:bg-beely-600 transition-colors"
                        >
                            Feed'e Git
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

