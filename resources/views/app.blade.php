<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- SEO Meta Tags -->
        <meta name="description" content="Beely - Ruh haline göre kişiselleştirilmiş video içerikler. AI destekli asistan Beely ile sana özel videolar keşfet.">
        <meta name="keywords" content="beely, video, kişiselleştirilmiş içerik, motivasyon, rahatlama, meditasyon, ai, yapay zeka">
        <meta name="author" content="Beely">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ config('app.url') }}">
        <meta property="og:title" content="Beely - Sana Özel Video Deneyimi">
        <meta property="og:description" content="Ruh haline göre kişiselleştirilmiş video içerikler. AI destekli asistan Beely ile sana özel videolar keşfet.">
        <meta property="og:image" content="{{ asset('og-image.png') }}">
        <meta property="og:locale" content="tr_TR">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ config('app.url') }}">
        <meta name="twitter:title" content="Beely - Sana Özel Video Deneyimi">
        <meta name="twitter:description" content="Ruh haline göre kişiselleştirilmiş video içerikler.">
        <meta name="twitter:image" content="{{ asset('og-image.png') }}">
        
        <!-- Theme Color -->
        <meta name="theme-color" content="#F59E0B">
        <meta name="msapplication-TileColor" content="#F59E0B">
        
        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">

        <title inertia>{{ config('app.name', 'Beely') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
