<?php

namespace App\Services;

use App\Models\Category;
use App\Models\ChatSession;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class BeelyService
{
    private string $systemPrompt;
    private array $categories;

    public function __construct()
    {
        try {
            $this->categories = Category::select('id', 'name', 'slug', 'description')->get()->toArray();
        } catch (\Exception $e) {
            Log::error('BeelyService: Failed to load categories', ['error' => $e->getMessage()]);
            $this->categories = [];
        }
        $this->systemPrompt = $this->buildSystemPrompt();
    }

    private function buildSystemPrompt(): string
    {
        $categoriesText = collect($this->categories)->map(function ($cat) {
            return "- {$cat['name']} (slug: {$cat['slug']}): {$cat['description']}";
        })->implode("\n");

        return <<<PROMPT
Sen "Beely" adında, kullanıcıların ruh haline göre video içerik öneren samimi ve empatik bir asistansın. 🐝

## Kimliğin
- Adın Beely, bir arı maskotu gibi enerjik ve pozitifsin
- Kullanıcıyla Türkçe konuşuyorsun
- Emoji kullanmayı seviyorsun ama abartmadan
- Kısa, öz ve samimi cevaplar veriyorsun (maksimum 2-3 cümle)
- Kullanıcının duygularını anlıyorsun ve ona göre içerik öneriyorsun

## Görevin
1. Kullanıcının nasıl hissettiğini anla (stresli, mutlu, üzgün, yorgun, odaklanamıyor, vb.)
2. Durumuna uygun kategori(ler) öner
3. Kullanıcıyı motive et ve pozitif tut

## Mevcut Video Kategorileri
{$categoriesText}

## Yanıt Formatı
Her yanıtında:
1. Kullanıcıya samimi bir cevap ver (1-3 cümle)
2. Uygun kategori önerileri varsa, yanıtının sonuna şu formatta ekle:
   [[CATEGORIES: slug1, slug2, slug3]]
   
Örnek: "Anlıyorum, bazen odaklanmak zor olabiliyor! 🎯 Sana konsantrasyonunu artıracak içerikler önereyim. [[CATEGORIES: odaklanma, meditasyon, muzik]]"

## Önemli Kurallar
- Her zaman Türkçe yanıt ver
- Kategori önerirken sadece mevcut kategorilerin slug'larını kullan
- Kullanıcı sadece selamlaşıyorsa, kategori önermeden sohbet et
- Maksimum 3 kategori öner, genelde 1-2 yeterli
- Kullanıcının duygusal durumuna uygun kategoriler seç
- Eğer kullanıcı ne istediğini tam anlamadıysan, nazikçe sor
PROMPT;
    }

    public function chat(ChatSession $session, string $userMessage): array
    {
        $previousMessages = $session->messages()
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->reverse()
            ->values();

        $messages = [
            ['role' => 'system', 'content' => $this->systemPrompt],
        ];

        foreach ($previousMessages as $msg) {
            $messages[] = [
                'role' => $msg->role,
                'content' => $msg->content,
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $userMsg = Message::create([
            'chat_session_id' => $session->id,
            'role' => 'user',
            'content' => $userMessage,
        ]);

        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'max_tokens' => 300,
                'temperature' => 0.7,
            ]);

            $assistantContent = $response->choices[0]->message->content;
            
            $suggestedCategories = $this->parseCategories($assistantContent);
            
            $cleanContent = $this->cleanContent($assistantContent);
            
            $detectedMood = $this->detectMood($userMessage);
            if ($detectedMood && !$session->mood_detected) {
                $session->update(['mood_detected' => $detectedMood]);
            }

            $assistantMsg = Message::create([
                'chat_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $cleanContent,
                'suggested_category_slugs' => $suggestedCategories,
            ]);

            return [
                'success' => true,
                'message' => [
                    'id' => $assistantMsg->id,
                    'role' => 'assistant',
                    'content' => $cleanContent,
                    'suggested_categories' => $this->getCategoryDetails($suggestedCategories),
                    'timestamp' => $assistantMsg->created_at->toISOString(),
                ],
            ];
        } catch (\Exception $e) {
            Log::error('BeelyService: OpenAI chat error', [
                'error' => $e->getMessage(),
                'session_id' => $session->id,
                'user_message' => $userMessage,
            ]);
            
            $fallbackResponse = $this->getFallbackResponse($userMessage);
            
            $detectedMood = $this->detectMood($userMessage);
            if ($detectedMood && !$session->mood_detected) {
                $session->update(['mood_detected' => $detectedMood]);
            }
            
            $assistantMsg = Message::create([
                'chat_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $fallbackResponse['content'],
                'suggested_category_slugs' => $fallbackResponse['categories'],
            ]);

            return [
                'success' => true,
                'message' => [
                    'id' => $assistantMsg->id,
                    'role' => 'assistant',
                    'content' => $fallbackResponse['content'],
                    'suggested_categories' => $this->getCategoryDetails($fallbackResponse['categories']),
                    'timestamp' => $assistantMsg->created_at->toISOString(),
                ],
            ];
        }
    }

    private function parseCategories(string $content): array
    {
        if (preg_match('/\[\[CATEGORIES:\s*([^\]]+)\]\]/', $content, $matches)) {
            $slugs = array_map('trim', explode(',', $matches[1]));
            $validSlugs = collect($this->categories)->pluck('slug')->toArray();
            return array_values(array_filter($slugs, fn($slug) => in_array($slug, $validSlugs)));
        }
        return [];
    }

    private function cleanContent(string $content): string
    {
        return trim(preg_replace('/\[\[CATEGORIES:[^\]]+\]\]/', '', $content));
    }

    private function getCategoryDetails(array $slugs): array
    {
        return collect($this->categories)
            ->filter(fn($cat) => in_array($cat['slug'], $slugs))
            ->map(fn($cat) => [
                'name' => $cat['name'],
                'slug' => $cat['slug'],
            ])
            ->values()
            ->toArray();
    }

    private function detectMood(string $message): ?string
    {
        $message = mb_strtolower($message);
        
        $moodKeywords = [
            'stresli' => ['stres', 'gergin', 'bunalmış', 'kaygı', 'endişe'],
            'yorgun' => ['yorgun', 'bitkin', 'halsiz', 'uykusuz', 'uyuyamıyorum'],
            'üzgün' => ['üzgün', 'mutsuz', 'kötü', 'depresif', 'hüzünlü'],
            'mutlu' => ['mutlu', 'iyi', 'harika', 'süper', 'muhteşem'],
            'sıkılmış' => ['sıkıl', 'canım sıkılıyor', 'eğlence'],
            'motivasyonsuz' => ['motiv', 'düştü', 'cesaretsiz', 'isteksiz'],
            'odaklanamıyor' => ['odaklan', 'konsantr', 'dikkat'],
        ];

        foreach ($moodKeywords as $mood => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($message, $keyword)) {
                    return $mood;
                }
            }
        }

        return null;
    }

    public function getWelcomeMessage(string $userName): array
    {
        $firstName = explode(' ', $userName)[0];
        
        return [
            'id' => 0,
            'role' => 'assistant',
            'content' => "Merhaba {$firstName}! 🐝 Ben Beely, senin kişisel içerik asistanın. Bugün nasıl hissediyorsun? Ruh haline göre sana en uygun videoları önerebilirim!",
            'suggested_categories' => [],
            'timestamp' => now()->toISOString(),
        ];
    }

    private function getFallbackResponse(string $userMessage): array
    {
        $message = mb_strtolower($userMessage);

        if ($this->containsAny($message, ['odaklan', 'konsantr', 'dikkat', 'çalış', 'ders'])) {
            return [
                'content' => 'Odaklanma modu açılıyor! 🎯 İşte konsantrasyonunu artıracak içerikler:',
                'categories' => ['odaklanma', 'meditasyon', 'muzik'],
            ];
        }

        if ($this->containsAny($message, ['uyu', 'yorgun', 'dinlen', 'gece', 'yatağa'])) {
            return [
                'content' => 'Derin bir uykuya dalmanı kolaylaştıracak içerikler hazırladım 🌙',
                'categories' => ['uyku', 'rahatlama', 'doga'],
            ];
        }

        if ($this->containsAny($message, ['sıkıl', 'eğlen', 'komik', 'güldür', 'keyif'])) {
            return [
                'content' => 'Gülmek en iyi ilaç! 😂 Eğlenceli içerikler seni bekliyor:',
                'categories' => ['eglence', 'muzik'],
            ];
        }

        if ($this->containsAny($message, ['stres', 'gergin', 'kayg', 'endişe', 'bunaldım'])) {
            return [
                'content' => 'Stresi azaltmak için sakinleştirici içerikler öneriyorum 🧘‍♀️',
                'categories' => ['stres', 'meditasyon', 'rahatlama'],
            ];
        }
            
        if ($this->containsAny($message, ['rahatla', 'gevşe', 'sakin', 'huzur'])) {
            return [
                'content' => 'Rahatlamak için mükemmel içerikler burada 💆‍♀️',
                'categories' => ['rahatlama', 'doga', 'meditasyon'],
            ];
        }

        if ($this->containsAny($message, ['motiv', 'düştü', 'cesaretsiz', 'isteksiz', 'enerji'])) {
            return [
                'content' => 'Motivasyon zamanı! 💪 İçindeki gücü ortaya çıkaracak içerikler:',
                'categories' => ['motivasyon', 'ilham', 'spor'],
            ];
        }

        if ($this->containsAny($message, ['ağr', 'kas', 'vücut', 'sırt', 'boyun'])) {
            return [
                'content' => 'Vücudunu rahatlatacak içerikler öneriyorum 🧘',
                'categories' => ['rahatlama', 'meditasyon', 'spor'],
            ];
        }

        if ($this->containsAny($message, ['spor', 'egzersiz', 'fitness', 'hareket', 'form'])) {
            return [
                'content' => 'Spor zamanı! 💪 Hareket etmen için harika içerikler:',
                'categories' => ['spor', 'motivasyon'],
            ];
        }

        if ($this->containsAny($message, ['müzik', 'şarkı', 'melodi', 'dinle'])) {
            return [
                'content' => 'Müzik her zaman iyi gelir! 🎵',
                'categories' => ['muzik'],
            ];
        }

        if ($this->containsAny($message, ['meditas', 'nefes', 'yoga', 'mindful'])) {
            return [
                'content' => 'Meditasyon ve nefes çalışmaları için harika içerikler ✨',
                'categories' => ['meditasyon', 'rahatlama'],
            ];
        }

        if ($this->containsAny($message, ['doğa', 'orman', 'deniz', 'dağ', 'kuş'])) {
            return [
                'content' => 'Doğanın huzurunu hisset 🌿',
                'categories' => ['doga', 'rahatlama'],
            ];
        }

        if ($this->containsAny($message, ['öğren', 'bilgi', 'eğitim', 'geliş'])) {
            return [
                'content' => 'Yeni şeyler öğrenmek harika! 📚',
                'categories' => ['ogrenme', 'ilham'],
            ];
        }

        if ($this->containsAny($message, ['ilham', 'fikir', 'yaratıcı', 'inspire'])) {
            return [
                'content' => 'İlham zamanı! 💡 Yaratıcılığını tetikleyecek içerikler:',
                'categories' => ['ilham', 'motivasyon'],
            ];
        }

        if ($this->containsAny($message, ['merhaba', 'selam', 'hey', 'nasıl', 'iyi'])) {
            return [
                'content' => 'Merhaba! 🐝 Bugün nasıl hissediyorsun? Sana uygun içerikler önerebilirim!',
                'categories' => [],
            ];
        }

        return [
            'content' => 'Seni anlıyorum! 🤔 Nasıl hissediyorsun? Stresli mi, yorgun mu, enerjik mi? Bana biraz daha anlat ki sana en uygun içerikleri önereyim.',
            'categories' => [],
        ];
    }

    private function containsAny(string $haystack, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }
        return false;
    }
}

