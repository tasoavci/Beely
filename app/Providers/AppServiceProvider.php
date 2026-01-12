<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Mailer\Transport\Dsn;
// DİKKAT: Aşağıdaki satırda "Bridge" kelimesi eklendi
use Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Mail::extend('brevo', function (array $config = []) {
            
            // SSL kontrolünü kapatan istemci
            $client = HttpClient::create([
                'verify_peer' => false,
                'verify_host' => false,
            ]);

            return (new BrevoTransportFactory(null, $client))->create(
                new Dsn(
                    'brevo+api',
                    'default',
                    $config['key']
                )
            );
        });
    }
}