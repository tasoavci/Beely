import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'], // Dark mode desteği
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans], // Modern font
            },
            colors: {
                beely: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    900: '#1a1a1a',
                    950: '#0f0f0f',
                }
            }
        },
    },

    plugins: [forms, require("tailwindcss-animate")],
};