<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->filled('categories')) {
            $query->whereHas('category', fn($q) => $q->whereIn('slug', (array) $request->categories));
        }
        if ($request->filled('brands')) {
            $query->whereIn('brand', (array) $request->brands);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('wattages')) {
            $query->whereIn('wattage', (array) $request->wattages);
        }

        $sort = $request->get('sort', 'featured');
        match ($sort) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest'     => $query->orderByDesc('created_at'),
            default      => $query->orderByDesc('is_featured')->orderBy('sort_order'),
        };

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
        $brands = Product::where('is_active', true)->distinct()->pluck('brand')->filter()->values();
        $wattages = Product::where('is_active', true)->distinct()->pluck('wattage')->filter()->values();

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'wattages' => $wattages,
            'filters' => $request->only(['categories', 'brands', 'min_price', 'max_price', 'wattages', 'sort']),
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $related = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
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
                'category' => ['name' => $p->category->name],
            ]);

        return Inertia::render('Shop/ProductDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'brand' => $product->brand,
                'wattage' => $product->wattage,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'stock_qty' => $product->stock_qty,
                'warranty_years' => $product->warranty_years,
                'images' => $product->images ?? [],
                'specifications' => $product->specifications ?? [],
                'category' => ['name' => $product->category->name, 'slug' => $product->category->slug],
            ],
            'relatedProducts' => $related,
        ]);
    }
}
