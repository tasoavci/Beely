<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // Eğer daha önce email gönderilmediyse, ilk email'i gönder
        // Laravel'de Registered event otomatik olarak email gönderir,
        // ama session'da status yoksa tekrar gönderelim
        if (!session()->has('status')) {
            $request->user()->sendEmailVerificationNotification();
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status', 'verification-link-sent'),
            'email' => $request->user()->email,
        ]);
    }
}
