<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Shop/Cart', [
            'cartItems' => CartService::getItems(),
            'cartTotal' => CartService::getTotal(),
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        CartService::add($product, $request->quantity);

        return back()->with('success', "{$product->name} added to cart.");
    }

    public function update(Request $request, int $itemId): RedirectResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        CartService::update($itemId, $request->quantity);
        return back();
    }

    public function remove(int $itemId): RedirectResponse
    {
        CartService::remove($itemId);
        return back()->with('success', 'Item removed from cart.');
    }
}
