<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\LikedVideosController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/feed/{category?}', [FeedController::class, 'index'])->name('feed');

    // Video like routes
    Route::post('/video/{video}/like', [FeedController::class, 'toggleLike'])->name('video.like');
    Route::get('/liked-videos', [LikedVideosController::class, 'index'])->name('liked-videos');

    Route::get('/chat', [ChatController::class, 'index'])->name('chat');
    Route::post('/chat/send', [ChatController::class, 'send'])->name('chat.send');
    Route::post('/chat/new', [ChatController::class, 'newSession'])->name('chat.new');
    Route::get('/chat/history', [ChatController::class, 'history'])->name('chat.history');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/veritabani-kur', function () {
    Artisan::call('migrate:fresh', ['--force' => true]);

    Artisan::call('db:seed', ['--force' => true]);
    
    return 'İşlem Başarılı! Veritabanı sıfırlandı ve dolduruldu.';
});

require __DIR__.'/auth.php';
