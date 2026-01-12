<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::select('id', 'name', 'slug', 'icon', 'description')
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories', [
            'categories' => $categories,
        ]);
    }
}

