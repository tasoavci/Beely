import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Send,
    Hexagon,
    Sparkles,
    Lightbulb,
    Music,
    BookOpen,
    Heart,
    Zap,
    RefreshCw,
    Play,
    Dumbbell,
    Laugh,
    Moon,
    Target,
    Leaf,
    Wind,
    HelpCircle,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryFromDB {
    name: string;
    slug: string;
    icon: string;
}

interface Message {
    id: string | number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    suggested_categories?: CategoryFromDB[];
}

interface Props {
    session: {
        id: string;
        title: string | null;
        mood_detected: string | null;
    } | null;
    initialMessages: Message[];
    categories: CategoryFromDB[];
}

const conversationStarters = [
    {
        text: "Bugün hiçbir şeye odaklanamıyorum, yardım et",
        emoji: "🧠",
    },
    {
        text: "Çok yorgunum ama uyuyamıyorum",
        emoji: "😴",
    },
    {
        text: "Canım çok sıkılıyor, eğlenceli bir şeyler bul",
        emoji: "😐",
    },
    {
        text: "Stresli bir gün geçirdim, rahatlamak istiyorum",
        emoji: "😮‍💨",
    },
    {
        text: "Motivasyonum düştü, beni motive et",
        emoji: "💪",
    },
    {
        text: "Vücudum ağrıyor, gevşemem lazım",
        emoji: "🧘",
    },
];

const quickPrompts = [
    {
        icon: Laugh,
        label: "Eğlence",
        prompt: "Bugün eğlenmek istiyorum, bana komik içerikler öner",
    },
    {
        icon: Heart,
        label: "Rahatlama",
        prompt: "Rahatlamak istiyorum, sakinleştirici içerikler öner",
    },
    {
        icon: Target,
        label: "Odaklanma",
        prompt: "Odaklanmam lazım, konsantrasyonumu artıracak içerikler öner",
    },
    {
        icon: Zap,
        label: "Motivasyon",
        prompt: "Motivasyonumu artıracak içerikler öner",
    },
];

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

export default function Chat({
    session: initialSession,
    initialMessages,
    categories,
}: Props) {
    const user = usePage().props.auth.user;
    const [sessionId, setSessionId] = useState<string | null>(
        initialSession?.id || null
    );
    const [messages, setMessages] = useState<Message[]>(() => {
        if (initialMessages && initialMessages.length > 0) {
            return initialMessages;
        }
        // Welcome message if no previous messages
        return [
            {
                id: 0,
                role: "assistant",
                content: `Merhaba ${
                    user.name.split(" ")[0]
                }! 🐝 Ben Beely, senin kişisel içerik asistanın. Bugün nasıl hissediyorsun? Ruh haline göre sana en uygun videoları önerebilirim!`,
                timestamp: new Date().toISOString(),
                suggested_categories: [],
            },
        ];
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isTyping) return;

        setError(null);

        // Add user message immediately
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: messageText,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await axios.post(route("chat.send"), {
                message: messageText,
                session_id: sessionId,
            });

            if (response.data.success) {
                setSessionId(response.data.session_id);

                const botMessage: Message = {
                    id: response.data.message.id,
                    role: "assistant",
                    content: response.data.message.content,
                    timestamp: response.data.message.timestamp,
                    suggested_categories:
                        response.data.message.suggested_categories,
                };

                setMessages((prev) => [...prev, botMessage]);
            } else {
                throw new Error("Yanıt alınamadı");
            }
        } catch (err: any) {
            console.error("Chat error:", err);
            setError("Bir hata oluştu. Lütfen tekrar dene.");

            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: "Oops! Bir sorun oluştu. Birazdan tekrar dener misin?",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleNewSession = async () => {
        try {
            const response = await axios.post(route("chat.new"));

            if (response.data.success) {
                setSessionId(response.data.session_id);
                setMessages([
                    {
                        id: 0,
                        role: "assistant",
                        content: `Yeni bir sohbet başlatalım! 🐝 Bugün sana nasıl yardımcı olabilirim, ${
                            user.name.split(" ")[0]
                        }?`,
                        timestamp: new Date().toISOString(),
                        suggested_categories: [],
                    },
                ]);
                setError(null);
            }
        } catch (err) {
            console.error("New session error:", err);
        }
    };

    const goToCategory = (slug: string) => {
        router.visit(route("feed", { category: slug }));
    };

    const goToMultiCategory = (categories: CategoryFromDB[]) => {
        const slugs = categories.map((c) => c.slug).join(",");
        router.visit(
            route("feed", { category: "sana-ozel", categories: slugs })
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Beely ile Sohbet" />

            <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
                <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {/* Chat header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center">
                                    <Hexagon className="h-5 w-5 text-white fill-current" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    Beely
                                </h2>
                                <p className="text-xs text-green-600">
                                    Çevrimiçi
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleNewSession}
                            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Yeni sohbet başlat"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`flex gap-3 max-w-[85%] ${
                                            message.role === "user"
                                                ? "flex-row-reverse"
                                                : ""
                                        }`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center flex-shrink-0">
                                                <Hexagon className="h-4 w-4 text-white fill-current" />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <div
                                                className={`px-4 py-3 rounded-2xl ${
                                                    message.role === "user"
                                                        ? "bg-beely-500 text-white rounded-br-md"
                                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
                                                }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {message.content}
                                                </p>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        message.role === "user"
                                                            ? "text-beely-200"
                                                            : "text-zinc-400"
                                                    }`}
                                                >
                                                    {formatTime(
                                                        message.timestamp
                                                    )}
                                                </p>
                                            </div>

                                            {/* Category links */}
                                            {message.suggested_categories &&
                                                message.suggested_categories
                                                    .length > 0 && (
                                                    <div className="flex flex-wrap gap-2 ml-0">
                                                        {message
                                                            .suggested_categories
                                                            .length > 1 ? (
                                                            // Multiple categories - show "Sana Özel" button
                                                            <button
                                                                onClick={() =>
                                                                    goToMultiCategory(
                                                                        message.suggested_categories!
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-beely-500 via-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:scale-105 transition-transform animate-pulse hover:animate-none"
                                                            >
                                                                <Sparkles className="h-5 w-5" />
                                                                Sana Özel
                                                                <Play className="h-4 w-4 ml-1" />
                                                            </button>
                                                        ) : (
                                                            // Single category - show category button
                                                            message.suggested_categories.map(
                                                                (cat) => {
                                                                    const IconComponent =
                                                                        getIcon(
                                                                            cat.icon
                                                                        );
                                                                    const gradient =
                                                                        getGradient(
                                                                            cat.slug
                                                                        );
                                                                    return (
                                                                        <button
                                                                            key={
                                                                                cat.slug
                                                                            }
                                                                            onClick={() =>
                                                                                goToCategory(
                                                                                    cat.slug
                                                                                )
                                                                            }
                                                                            className={`inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${gradient} text-white rounded-xl text-sm font-medium shadow-lg hover:scale-105 transition-transform`}
                                                                        >
                                                                            <IconComponent className="h-4 w-4" />
                                                                            {
                                                                                cat.name
                                                                            }
                                                                            <Play className="h-3 w-3 ml-1" />
                                                                        </button>
                                                                    );
                                                                }
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-beely-400 to-beely-600 flex items-center justify-center">
                                    <Hexagon className="h-4 w-4 text-white fill-current" />
                                </div>
                                <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                                        <span
                                            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-red-500 text-sm py-2"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Conversation starters */}
                    {messages.length <= 2 && (
                        <div className="px-4 pb-3 space-y-3">
                            <p className="text-xs text-zinc-500 font-medium">
                                💬 Sohbete şöyle başlayabilirsin:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {conversationStarters.map((starter, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSend(starter.text)}
                                        disabled={isTyping}
                                        className="flex items-start gap-2 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-beely-50 dark:hover:bg-beely-900/20 border border-zinc-200 dark:border-zinc-700 hover:border-beely-300 dark:hover:border-beely-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs text-left transition-all disabled:opacity-50"
                                    >
                                        <span className="text-base">
                                            {starter.emoji}
                                        </span>
                                        <span className="leading-relaxed">
                                            {starter.text}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Quick category buttons */}
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs text-zinc-400 mb-2">
                                    Hızlı kategori:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt.label}
                                            onClick={() =>
                                                handleSend(prompt.prompt)
                                            }
                                            disabled={isTyping}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-beely-100 dark:hover:bg-beely-900/30 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                                        >
                                            <prompt.icon className="h-3.5 w-3.5" />
                                            {prompt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input area */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Beely'ye bir şeyler yaz..."
                                    rows={1}
                                    disabled={isTyping}
                                    className="w-full px-4 py-3 pr-12 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-beely-500 resize-none disabled:opacity-50"
                                    style={{
                                        minHeight: "48px",
                                        maxHeight: "120px",
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="h-12 w-12 flex items-center justify-center bg-beely-500 hover:bg-beely-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 text-white rounded-xl transition-colors"
                            >
                                {isTyping ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2 text-center">
                            Beely yapay zeka ile sana ruh haline uygun içerikler
                            önerir.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
