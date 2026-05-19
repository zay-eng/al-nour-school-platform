<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrator
        User::create([
            'name' => 'المدير العام',
            'email' => 'admin@alnour.edu',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
            'phone' => '+213 555 123 456',
            'is_active' => true,
            'preferred_language' => 'ar',
        ]);

        // Teacher
        User::create([
            'name' => 'الأستاذ محمد',
            'email' => 'teacher@alnour.edu',
            'password' => Hash::make('Teacher@123'),
            'role' => 'teacher',
            'phone' => '+213 555 234 567',
            'is_active' => true,
            'preferred_language' => 'ar',
        ]);

        // Parent
        User::create([
            'name' => 'ولي الأمر أحمد',
            'email' => 'parent@alnour.edu',
            'password' => Hash::make('Parent@123'),
            'role' => 'parent',
            'phone' => '+213 555 345 678',
            'is_active' => true,
            'preferred_language' => 'ar',
        ]);

        // Additional test users
        User::create([
            'name' => 'الأستاذة فاطمة',
            'email' => 'fatima.teacher@alnour.edu',
            'password' => Hash::make('Teacher@123'),
            'role' => 'teacher',
            'phone' => '+213 555 456 789',
            'is_active' => true,
            'preferred_language' => 'ar',
        ]);

        User::create([
            'name' => 'ولي الأمر سارة',
            'email' => 'sara.parent@alnour.edu',
            'password' => Hash::make('Parent@123'),
            'role' => 'parent',
            'phone' => '+213 555 567 890',
            'is_active' => true,
            'preferred_language' => 'ar',
        ]);
    }
}
