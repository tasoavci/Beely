<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\LikedVideo;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request, ?string $categorySlug = null): Response
    {
        $user = $request->user();
        $category = null;
        $videos = collect();
        $isPersonalized = false;
        $personalizedCategories = collect();

        // Kullanıcının beğendiği video ID'leri
        $likedVideoIds = $user->likedVideos()->pluck('videos.id')->toArray();

        // Video limiti - performans için
        $videoLimit = 50;
        $isLikedFeed = false;

        // "Beğenilenler" - sadece beğenilen videolar (gizli kategori)
        if ($categorySlug === 'liked') {
            $videos = Video::whereIn('id', $likedVideoIds)
                ->where('is_active', true)
                ->with('category:id,name,slug,icon')
                ->inRandomOrder()
                ->limit($videoLimit)
                ->get();
            
            $isLikedFeed = true;
        }
        // "Sana Özel" - çoklu kategori
        elseif ($categorySlug === 'sana-ozel') {
            $categorySlugs = $request->query('categories', '');
            $slugsArray = array_filter(explode(',', $categorySlugs));
            
            if (!empty($slugsArray)) {
                $personalizedCategories = Category::whereIn('slug', $slugsArray)
                    ->select('id', 'name', 'slug', 'icon')
                    ->get();
                
                $categoryIds = $personalizedCategories->pluck('id')->toArray();
                
                // Her kategoriden eşit sayıda video al
                $perCategoryLimit = max(10, intval($videoLimit / count($categoryIds)));
                $videos = collect();
                
                foreach ($categoryIds as $catId) {
                    $catVideos = Video::where('category_id', $catId)
                        ->where('is_active', true)
                        ->with('category:id,name,slug,icon')
                        ->inRandomOrder()
                        ->limit($perCategoryLimit)
                        ->get();
                    $videos = $videos->merge($catVideos);
                }
                
                // Karıştır
                $videos = $videos->shuffle();
                
                $isPersonalized = true;
            }
        } elseif ($categorySlug) {
            // Tekil kategori
            $category = Category::where('slug', $categorySlug)->first();
            
            if ($category) {
                $videos = Video::where('category_id', $category->id)
                    ->where('is_active', true)
                    ->with('category:id,name,slug,icon')
                    ->inRandomOrder()
                    ->limit($videoLimit)
                    ->get();
            }
        } else {
            // Tüm kategorilerden rastgele videolar - her kategoriden eşit dağılım
            $allCategories = Category::pluck('id')->toArray();
            $perCategoryLimit = max(5, intval($videoLimit / count($allCategories)));
            $videos = collect();
            
            foreach ($allCategories as $catId) {
                $catVideos = Video::where('category_id', $catId)
                    ->where('is_active', true)
                    ->with('category:id,name,slug,icon')
                    ->inRandomOrder()
                    ->limit($perCategoryLimit)
                    ->get();
                $videos = $videos->merge($catVideos);
            }
            
            // Karıştır
            $videos = $videos->shuffle();
        }

        // Tüm kategorileri gönder
        $categories = Category::select('id', 'name', 'slug', 'icon')->get();

        return Inertia::render('Feed', [
            'category' => $category ? [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
            ] : null,
            'isPersonalized' => $isPersonalized,
            'isLikedFeed' => $isLikedFeed,
            'personalizedCategories' => $personalizedCategories->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'icon' => $cat->icon,
            ])->toArray(),
            'videos' => $videos->map(fn ($video) => [
                'id' => $video->id,
                'videoUrl' => $video->video_url,
                'category' => $video->category ? [
                    'id' => $video->category->id,
                    'name' => $video->category->name,
                    'slug' => $video->category->slug,
                    'icon' => $video->category->icon,
                ] : null,
            ]),
            'likedVideoIds' => $likedVideoIds,
            'categories' => $categories,
        ]);
    }

    public function toggleLike(Request $request, Video $video): JsonResponse
    {
        $user = $request->user();

        $existingLike = LikedVideo::where('user_id', $user->id)
            ->where('video_id', $video->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $isLiked = false;
        } else {
            LikedVideo::create([
                'user_id' => $user->id,
                'video_id' => $video->id,
            ]);
            $isLiked = true;
        }

        return response()->json([
            'success' => true,
            'isLiked' => $isLiked,
        ]);
    }
}
