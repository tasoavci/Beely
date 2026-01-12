<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Video;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    public function run(): void
    {
        $s3BaseUrl = 'https://beely.s3.eu-north-1.amazonaws.com';
        $videosPerCategory = 10;

        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->error("Önce kategorileri seed etmelisiniz: php artisan db:seed --class=CategorySeeder");
            return;
        }

        $totalVideos = 0;

        foreach ($categories as $category) {
            for ($i = 1; $i <= $videosPerCategory; $i++) {
                $videoUrl = "{$s3BaseUrl}/{$category->slug}/{$category->slug}_{$i}.mp4";

                Video::create([
                    'category_id' => $category->id,
                    'video_url' => $videoUrl,
                    'is_active' => true,
                ]);

                $totalVideos++;
            }

            $this->command->info("✅ {$category->name}: {$videosPerCategory} video eklendi");
        }

        $this->command->newLine();
        $this->command->info("🎉 Toplam {$totalVideos} video başarıyla eklendi!");
    }
}
