<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Residential Solar Installation',
                'slug' => 'residential-solar-installation',
                'short_description' => 'Professional rooftop solar installation for homes in Cambodia.',
                'description' => '<p>Our certified technicians handle everything from site survey to final commissioning. We install grid-tie and hybrid systems for residential properties across Cambodia.</p>',
                'image' => 'services/residential.jpg',
                'base_price' => 500.00,
                'price_unit' => 'per_kw',
                'duration' => '1-3 days',
                'features' => [
                    'Free site survey and system design',
                    'Professional certified installers',
                    'All permits and approvals handled',
                    'System monitoring setup',
                    '2-year installation warranty',
                    'Post-installation training',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Commercial Solar Installation',
                'slug' => 'commercial-solar-installation',
                'short_description' => 'Large-scale solar solutions for businesses, factories, and commercial buildings.',
                'description' => '<p>Reduce your business electricity bills by up to 70% with a custom commercial solar system. We design and install systems from 20kW to 1MW+.</p>',
                'image' => 'services/commercial.jpg',
                'base_price' => 450.00,
                'price_unit' => 'per_kw',
                'duration' => '3-14 days',
                'features' => [
                    'Dedicated project manager',
                    'Custom system design',
                    'Load analysis and optimization',
                    'Grid connection assistance',
                    '3-year installation warranty',
                    'Annual maintenance included (1st year)',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Solar System Maintenance',
                'slug' => 'solar-maintenance',
                'short_description' => 'Annual maintenance to keep your solar system performing at peak efficiency.',
                'description' => '<p>Regular maintenance prevents performance degradation and extends the life of your solar system. Our maintenance package includes full system inspection, panel cleaning, and performance report.</p>',
                'image' => 'services/maintenance.jpg',
                'base_price' => 80.00,
                'price_unit' => 'flat',
                'duration' => 'Half day',
                'features' => [
                    'Panel cleaning and inspection',
                    'Inverter health check',
                    'Wiring and connection inspection',
                    'Performance data analysis',
                    'Written maintenance report',
                    'Priority support for 30 days after visit',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'System Health Check',
                'slug' => 'system-health-check',
                'short_description' => 'Comprehensive diagnostic check for underperforming solar systems.',
                'description' => '<p>Is your solar system not producing as much power as expected? Our technicians will diagnose the issue and provide a detailed report with recommendations.</p>',
                'image' => 'services/health-check.jpg',
                'base_price' => 50.00,
                'price_unit' => 'flat',
                'duration' => '2-3 hours',
                'features' => [
                    'IV curve testing on all panels',
                    'Thermal imaging scan',
                    'Inverter diagnostic',
                    'Energy yield analysis',
                    'Detailed fault report',
                    'Repair cost estimate',
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Battery Storage Installation',
                'slug' => 'battery-storage-installation',
                'short_description' => 'Add battery backup to your existing solar system for 24/7 power.',
                'description' => '<p>Upgrade your existing solar installation with battery storage. Perfect for businesses and homes that want backup power during outages or to maximize self-consumption.</p>',
                'image' => 'services/battery.jpg',
                'base_price' => 200.00,
                'price_unit' => 'flat',
                'duration' => '1 day',
                'features' => [
                    'Battery system design and sizing',
                    'Professional installation',
                    'Hybrid inverter upgrade if needed',
                    'Smart energy management setup',
                    '1-year installation warranty',
                    'Remote monitoring configuration',
                ],
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Free Solar Consultation',
                'slug' => 'free-solar-consultation',
                'short_description' => 'No-obligation site assessment and custom solar proposal for your property.',
                'description' => '<p>Not sure where to start? Our solar experts will visit your property, assess your energy needs, and provide a detailed proposal with ROI calculations — completely free of charge.</p>',
                'image' => 'services/consultation.jpg',
                'base_price' => 0.00,
                'price_unit' => 'flat',
                'duration' => '1-2 hours',
                'features' => [
                    'On-site energy consumption analysis',
                    'Roof suitability assessment',
                    'Custom system sizing',
                    'ROI and payback calculation',
                    'Financing options discussion',
                    'No obligation whatsoever',
                ],
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
