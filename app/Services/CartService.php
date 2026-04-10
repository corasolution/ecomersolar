<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class CartService
{
    private static string $sessionKey = 'cart';

    public static function getItems(): array
    {
        return session(self::$sessionKey, []);
    }

    public static function getCount(Request $request): int
    {
        $items = $request->session()->get(self::$sessionKey, []);
        return array_sum(array_column($items, 'quantity'));
    }

    public static function getTotal(): float
    {
        return array_sum(array_map(
            fn($item) => $item['price'] * $item['quantity'],
            self::getItems()
        ));
    }

    public static function isEmpty(): bool
    {
        return empty(self::getItems());
    }

    public static function add(Product $product, int $quantity = 1): void
    {
        $cart = self::getItems();
        $price = $product->sale_price ?? $product->price;

        foreach ($cart as &$item) {
            if ($item['product_id'] === $product->id) {
                $item['quantity'] = min($item['quantity'] + $quantity, $product->stock_qty);
                session([self::$sessionKey => $cart]);
                return;
            }
        }

        $cart[] = [
            'id'         => uniqid(),
            'product_id' => $product->id,
            'name'       => $product->name,
            'sku'        => $product->sku,
            'price'      => (float) $price,
            'quantity'   => min($quantity, $product->stock_qty),
            'image'      => $product->first_image,
            'stock_qty'  => $product->stock_qty,
        ];

        session([self::$sessionKey => $cart]);
    }

    public static function update(string $itemId, int $quantity): void
    {
        $cart = self::getItems();
        foreach ($cart as &$item) {
            if ($item['id'] === $itemId) {
                $item['quantity'] = min($quantity, $item['stock_qty']);
                break;
            }
        }
        session([self::$sessionKey => $cart]);
    }

    public static function remove(string $itemId): void
    {
        $cart = array_filter(self::getItems(), fn($item) => $item['id'] !== $itemId);
        session([self::$sessionKey => array_values($cart)]);
    }

    public static function clear(): void
    {
        session()->forget(self::$sessionKey);
    }
}
