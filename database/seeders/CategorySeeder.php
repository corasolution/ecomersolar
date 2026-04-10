<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Solar Panels', 'slug' => 'solar-panels', 'description' => 'High-efficiency photovoltaic solar panels for residential and commercial use.', 'sort_order' => 1],
            ['name' => 'Inverters', 'slug' => 'inverters', 'description' => 'Convert DC power from solar panels to AC power for your home or business.', 'sort_order' => 2],
            ['name' => 'Batteries', 'slug' => 'batteries', 'description' => 'Energy storage solutions to power your home day and night.', 'sort_order' => 3],
            ['name' => 'Solar Kits', 'slug' => 'solar-kits', 'description' => 'Complete solar power system packages for easy installation.', 'sort_order' => 4],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Mounting hardware, cables, connectors, and other solar accessories.', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
