<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminVideoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Video::with('category:id,name,slug');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('video_url', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('slug', 'like', "%{$search}%");
                  });
            });
        }

        $videos = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        $categories = Category::select('id', 'name', 'slug')->get();

        return Inertia::render('Admin/Videos', [
            'videos' => $videos,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'video_url' => 'required|url',
            'category_id' => 'required|exists:categories,id',
        ]);

        Video::create([
            'video_url' => $validated['video_url'],
            'category_id' => $validated['category_id'],
            'is_active' => true,
        ]);

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video başarıyla eklendi.');
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video başarıyla silindi.');
    }
}
