<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::truncate();

        $categories = [
            [
                'name' => 'Motivasyon',
                'slug' => 'motivasyon',
                'icon' => 'Zap',
                'description' => 'İçindeki gücü ortaya çıkar. Harekete geçmek için ihtiyacın olan kıvılcım.',
            ],
            [
                'name' => 'Rahatlama',
                'slug' => 'rahatlama',
                'icon' => 'Heart',
                'description' => 'Kaslarını gevşetip zihnini ve bedenini dinlendirecek içerikler.',
            ],
            [
                'name' => 'Eğlence',
                'slug' => 'eglence',
                'icon' => 'Laugh',
                'description' => 'Gülmek en iyi ilaçtır. Keyfini yerine getirecek en eğlenceli anlar.',
            ],
            [
                'name' => 'Uyku',
                'slug' => 'uyku',
                'icon' => 'Moon',
                'description' => 'Derin ve huzurlu bir uykuya dalmanı kolaylaştıracak içerikler.',
            ],
            [
                'name' => 'Odaklanma',
                'slug' => 'odaklanma',
                'icon' => 'Target',
                'description' => 'Dikkatin dağılmadan çalışmanı ve üretmeni sağlayacak flow ortamı.',
            ],
            [
                'name' => 'Meditasyon',
                'slug' => 'meditasyon',
                'icon' => 'Sparkles',
                'description' => 'İç huzuru bul. Nefes al ve anın tadını çıkar.',
            ],
            [
                'name' => 'Doğa',
                'slug' => 'doga',
                'icon' => 'Leaf',
                'description' => 'Doğanın dinlendirici sesleri ve manzaraları.',
            ],
            [
                'name' => 'Müzik',
                'slug' => 'muzik',
                'icon' => 'Music',
                'description' => 'Ruhunu besleyecek melodiler ve ritimler.',
            ],
            [
                'name' => 'Spor',
                'slug' => 'spor',
                'icon' => 'Dumbbell',
                'description' => 'Enerjini yükselt, formda kal.',
            ],
            [
                'name' => 'Öğrenme',
                'slug' => 'ogrenme',
                'icon' => 'BookOpen',
                'description' => 'Yeni şeyler öğren, kendini geliştir.',
            ],
            [
                'name' => 'İlham',
                'slug' => 'ilham',
                'icon' => 'Lightbulb',
                'description' => 'Yaratıcılığını tetikleyecek fikirler ve hikayeler.',
            ],
            [
                'name' => 'Stres Yönetimi',
                'slug' => 'stres',
                'icon' => 'Wind',
                'description' => 'Stresi azalt, sakinleş ve kendine gel.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}