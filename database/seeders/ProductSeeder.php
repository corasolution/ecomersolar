<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $panelCat = Category::where('slug', 'solar-panels')->first();
        $inverterCat = Category::where('slug', 'inverters')->first();
        $batteryCat = Category::where('slug', 'batteries')->first();
        $kitCat = Category::where('slug', 'solar-kits')->first();
        $accessCat = Category::where('slug', 'accessories')->first();

        $products = [
            // Solar Panels
            [
                'category_id' => $panelCat->id,
                'name' => 'JA Solar 550W Monocrystalline Panel',
                'slug' => 'ja-solar-550w-mono',
                'sku' => 'JA-550W-MONO',
                'brand' => 'JA Solar',
                'wattage' => '550W',
                'short_description' => 'High-efficiency monocrystalline solar panel with 21.3% efficiency and 25-year performance warranty.',
                'description' => '<p>The JA Solar 550W Monocrystalline Panel delivers outstanding performance in Cambodia\'s tropical climate. Featuring advanced PERC technology, this panel maintains high efficiency even in low-light conditions and high temperatures.</p><ul><li>25-year linear power warranty</li><li>12-year product warranty</li><li>Certified for extreme weather conditions</li></ul>',
                'price' => 185.00,
                'sale_price' => 165.00,
                'stock_qty' => 50,
                'warranty_years' => 25,
                'images' => ['products/ja-solar-550w.jpg'],
                'specifications' => [
                    'Peak Power' => '550W',
                    'Efficiency' => '21.3%',
                    'Cell Type' => 'Monocrystalline PERC',
                    'Dimensions' => '2278 × 1134 × 35mm',
                    'Weight' => '28.0 kg',
                    'Max System Voltage' => '1500VDC',
                    'Operating Temperature' => '-40°C to +85°C',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $panelCat->id,
                'name' => 'Canadian Solar 400W HiKu Panel',
                'slug' => 'canadian-solar-400w-hiku',
                'sku' => 'CS-400W-HIKU',
                'brand' => 'Canadian Solar',
                'wattage' => '400W',
                'short_description' => 'Reliable 400W panel with excellent temperature coefficient, ideal for Cambodian climate.',
                'description' => '<p>Canadian Solar HiKu panels are engineered for reliability and performance in hot, humid climates. Perfect for residential rooftop installations in Cambodia.</p>',
                'price' => 120.00,
                'sale_price' => null,
                'stock_qty' => 80,
                'warranty_years' => 25,
                'images' => ['products/canadian-400w.jpg'],
                'specifications' => [
                    'Peak Power' => '400W',
                    'Efficiency' => '19.9%',
                    'Cell Type' => 'Monocrystalline',
                    'Dimensions' => '1979 × 1002 × 40mm',
                    'Weight' => '21.5 kg',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => $panelCat->id,
                'name' => 'Longi Solar 450W Hi-MO Panel',
                'slug' => 'longi-solar-450w-himo',
                'sku' => 'LG-450W-HIMO',
                'brand' => 'Longi',
                'wattage' => '450W',
                'short_description' => 'Award-winning bifacial solar panel for maximum energy harvest.',
                'description' => '<p>Longi Hi-MO bifacial panels generate power from both sides, increasing total yield by up to 30% in optimal conditions. Ideal for ground-mount and commercial rooftop systems.</p>',
                'price' => 145.00,
                'sale_price' => 130.00,
                'stock_qty' => 35,
                'warranty_years' => 25,
                'images' => ['products/longi-450w.jpg'],
                'specifications' => [
                    'Peak Power' => '450W',
                    'Efficiency' => '20.7%',
                    'Cell Type' => 'Monocrystalline Bifacial',
                    'Dimensions' => '2094 × 1038 × 35mm',
                    'Weight' => '24.3 kg',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
            ],
            // Inverters
            [
                'category_id' => $inverterCat->id,
                'name' => 'Growatt 5kW String Inverter',
                'slug' => 'growatt-5kw-string',
                'sku' => 'GW-5000TL3-S',
                'brand' => 'Growatt',
                'wattage' => '5000W',
                'short_description' => 'Reliable 5kW single-phase string inverter with built-in WiFi monitoring.',
                'description' => '<p>The Growatt 5kW string inverter is perfect for residential solar systems. Features include built-in MPPT, WiFi monitoring via ShinePhone app, and a compact design.</p>',
                'price' => 450.00,
                'sale_price' => 395.00,
                'stock_qty' => 20,
                'warranty_years' => 10,
                'images' => ['products/growatt-5kw.jpg'],
                'specifications' => [
                    'Max DC Input Power' => '6000W',
                    'Max AC Output Power' => '5000W',
                    'Max Efficiency' => '98.4%',
                    'MPPT Voltage Range' => '70-560V',
                    'Communication' => 'WiFi, RS485',
                    'Warranty' => '10 years',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $inverterCat->id,
                'name' => 'Sungrow 10kW Hybrid Inverter',
                'slug' => 'sungrow-10kw-hybrid',
                'sku' => 'SH10RS',
                'brand' => 'Sungrow',
                'wattage' => '10000W',
                'short_description' => 'Hybrid inverter supporting both grid-tie and battery storage for 24/7 power.',
                'description' => '<p>The Sungrow SH10RS hybrid inverter seamlessly integrates solar panels and battery storage, ensuring uninterrupted power supply even during grid outages.</p>',
                'price' => 1200.00,
                'sale_price' => null,
                'stock_qty' => 8,
                'warranty_years' => 10,
                'images' => ['products/sungrow-10kw.jpg'],
                'specifications' => [
                    'Max PV Input Power' => '15000W',
                    'Rated AC Output' => '10000W',
                    'Battery Voltage Range' => '80-460V',
                    'Max Efficiency' => '98.6%',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 2,
            ],
            // Batteries
            [
                'category_id' => $batteryCat->id,
                'name' => 'BYD Battery-Box Premium 10kWh',
                'slug' => 'byd-battery-box-10kwh',
                'sku' => 'BYD-HVM-10.2',
                'brand' => 'BYD',
                'wattage' => '10200Wh',
                'short_description' => 'Lithium iron phosphate battery for safe, long-lasting energy storage.',
                'description' => '<p>BYD Battery-Box Premium uses LFP (LiFePO4) chemistry for maximum safety and a 10,000+ cycle life. Ideal for homes wanting full energy independence.</p>',
                'price' => 2500.00,
                'sale_price' => 2200.00,
                'stock_qty' => 5,
                'warranty_years' => 10,
                'images' => ['products/byd-10kwh.jpg'],
                'specifications' => [
                    'Capacity' => '10.2 kWh',
                    'Chemistry' => 'LiFePO4',
                    'Cycle Life' => '> 6000 cycles',
                    'Depth of Discharge' => '100%',
                    'Operating Temperature' => '-10°C to 50°C',
                    'Warranty' => '10 years',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            // Solar Kits
            [
                'category_id' => $kitCat->id,
                'name' => '5kW On-Grid Solar Kit (Home)',
                'slug' => '5kw-on-grid-kit-home',
                'sku' => 'KIT-5KW-GRID',
                'brand' => 'SolaraKH',
                'wattage' => '5000W',
                'short_description' => 'Complete 5kW on-grid package: 10×550W panels + 5kW inverter + mounting + cables.',
                'description' => '<p>Everything you need for a 5kW rooftop solar installation. This complete kit includes 10 JA Solar 550W panels, a Growatt 5kW inverter, aluminium mounting rails, MC4 connectors, DC cables, and installation guide. Professional installation available.</p>',
                'price' => 3200.00,
                'sale_price' => 2850.00,
                'stock_qty' => 10,
                'warranty_years' => 15,
                'images' => ['products/5kw-kit.jpg'],
                'specifications' => [
                    'System Capacity' => '5 kWp',
                    'Panels' => '10 × JA Solar 550W',
                    'Inverter' => 'Growatt 5000TL3-S',
                    'Mounting' => 'Aluminium rail system',
                    'Avg Daily Output' => '~18-22 kWh',
                    'Payback Period' => '3-4 years',
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $kitCat->id,
                'name' => '10kW Off-Grid Solar Kit',
                'slug' => '10kw-off-grid-kit',
                'sku' => 'KIT-10KW-OFFGRID',
                'brand' => 'SolaraKH',
                'wattage' => '10000W',
                'short_description' => '10kW off-grid system with 20kWh battery storage — full energy independence.',
                'description' => '<p>Perfect for rural properties or businesses needing complete energy independence. Includes panels, hybrid inverter, 20kWh LFP battery bank, and all balance-of-system components.</p>',
                'price' => 9800.00,
                'sale_price' => null,
                'stock_qty' => 3,
                'warranty_years' => 15,
                'images' => ['products/10kw-offgrid.jpg'],
                'specifications' => [
                    'System Capacity' => '10 kWp',
                    'Battery Storage' => '20 kWh',
                    'Battery Type' => 'LiFePO4',
                    'Inverter' => 'Sungrow 10kW Hybrid',
                    'Avg Daily Output' => '40-50 kWh',
                ],
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 2,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
