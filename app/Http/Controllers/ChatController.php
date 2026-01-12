<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ChatSession;
use App\Services\BeelyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Aktif veya yeni session
        $session = ChatSession::where('user_id', $user->id)
            ->latest()
            ->first();
        
        $messages = [];
        
        if ($session) {
            // Mevcut mesajları al
            $messages = $session->messages()
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($msg) {
                    $categories = [];
                    if ($msg->suggested_category_slugs) {
                        $categories = Category::whereIn('slug', $msg->suggested_category_slugs)
                            ->select('name', 'slug', 'icon')
                            ->get()
                            ->toArray();
                    }
                    
                    return [
                        'id' => $msg->id,
                        'role' => $msg->role,
                        'content' => $msg->content,
                        'suggested_categories' => $categories,
                        'timestamp' => $msg->created_at->toISOString(),
                    ];
                })
                ->toArray();
        }

        // Kategorileri al
        $categories = Category::select('id', 'name', 'slug', 'icon')->get()->toArray();

        return Inertia::render('Chat', [
            'session' => $session ? [
                'id' => $session->id,
                'title' => $session->title,
                'mood_detected' => $session->mood_detected,
            ] : null,
            'initialMessages' => $messages,
            'categories' => $categories,
        ]);
    }

    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'session_id' => 'nullable|string',
        ]);

        $user = $request->user();
        $message = $request->input('message');
        $sessionId = $request->input('session_id');

        // Session bul veya oluştur
        if ($sessionId) {
            $session = ChatSession::where('id', $sessionId)
                ->where('user_id', $user->id)
                ->first();
        }

        if (!isset($session) || !$session) {
            $session = ChatSession::create([
                'user_id' => $user->id,
                'title' => mb_substr($message, 0, 50),
            ]);
        }

        // Beely servisini çağır
        $beelyService = new BeelyService();
        $result = $beelyService->chat($session, $message);

        // Kategori detaylarını ekle
        if (!empty($result['message']['suggested_categories'])) {
            $slugs = collect($result['message']['suggested_categories'])->pluck('slug')->toArray();
            $result['message']['suggested_categories'] = Category::whereIn('slug', $slugs)
                ->select('name', 'slug', 'icon')
                ->get()
                ->toArray();
        }

        return response()->json([
            'success' => $result['success'],
            'session_id' => $session->id,
            'message' => $result['message'],
        ]);
    }

    public function newSession(Request $request): JsonResponse
    {
        $user = $request->user();

        $session = ChatSession::create([
            'user_id' => $user->id,
        ]);

        $beelyService = new BeelyService();
        $welcomeMessage = $beelyService->getWelcomeMessage($user->name);

        return response()->json([
            'success' => true,
            'session_id' => $session->id,
            'message' => $welcomeMessage,
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $sessions = ChatSession::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => $session->title ?: 'Yeni Sohbet',
                    'mood_detected' => $session->mood_detected,
                    'created_at' => $session->created_at->toISOString(),
                    'message_count' => $session->messages()->count(),
                ];
            });

        return response()->json([
            'success' => true,
            'sessions' => $sessions,
        ]);
    }
}

