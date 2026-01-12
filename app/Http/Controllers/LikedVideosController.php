<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LikedVideosController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $likedVideos = $user->likedVideos()
            ->with('category:id,name,slug,icon')
            ->orderByPivot('created_at', 'desc')
            ->get();

        return Inertia::render('LikedVideos', [
            'videos' => $likedVideos->map(fn ($video) => [
                'id' => $video->id,
                'videoUrl' => $video->video_url,
                'category' => $video->category ? [
                    'id' => $video->category->id,
                    'name' => $video->category->name,
                    'slug' => $video->category->slug,
                    'icon' => $video->category->icon,
                ] : null,
                'likedAt' => $video->pivot->created_at->toISOString(),
            ]),
        ]);
    }
}

