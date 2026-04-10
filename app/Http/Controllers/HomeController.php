<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredProducts = Product::with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->limit(4)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'brand' => $p->brand,
                'wattage' => $p->wattage,
                'price' => $p->price,
                'sale_price' => $p->sale_price,
                'stock_qty' => $p->stock_qty,
                'first_image' => $p->first_image,
                'category' => ['name' => $p->category->name, 'slug' => $p->category->slug],
            ]);

        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->limit(3)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'short_description' => $s->short_description,
                'base_price' => $s->base_price,
                'price_unit' => $s->price_unit,
                'image' => $s->image,
            ]);

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'services' => $services,
        ]);
    }
}
