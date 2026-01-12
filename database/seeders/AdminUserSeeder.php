<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@beely.app'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        if ($admin->wasRecentlyCreated) {
            $this->command->info('Admin kullanıcısı oluşturuldu: admin@beely.app / admin123');
        } else {
            // Eğer kullanıcı zaten varsa, admin yap ve şifreyi güncelle
            $admin->role = 'admin';
            $admin->password = Hash::make('admin123');
            $admin->email_verified_at = now();
            $admin->save();
            $this->command->info('Admin kullanıcısı güncellendi: admin@beely.app / admin123');
        }
    }
}
