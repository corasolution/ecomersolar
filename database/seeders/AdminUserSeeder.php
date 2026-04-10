<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@solarakh.com'],
            [
                'name' => 'SolaraKH Admin',
                'email' => 'admin@solarakh.com',
                'password' => Hash::make('admin123456'),
                'email_verified_at' => now(),
            ]
        );
    }
}
