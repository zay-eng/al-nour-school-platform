<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Enable session for tests
        $this->withSession([]);
        
        // Clear rate limiter before each test
        RateLimiter::clear('login-attempts:test@test.com|127.0.0.1');
    }

    /** @test */
    public function it_blocks_login_after_5_failed_attempts()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'test@test.com',
            'password' => Hash::make('correct-password'),
            'is_active' => true,
        ]);

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/auth/login', [
                'email' => 'test@test.com',
                'password' => 'wrong-password',
            ]);
            
            $this->assertContains($response->status(), [401, 429]);
        }

        // 6th attempt should be blocked with 429
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429);
        $response->assertJsonStructure(['retry_after']);
    }

    /** @test */
    public function it_gives_generic_error_on_wrong_password()
    {
        $user = User::factory()->create([
            'email' => 'admin@alnour.edu',
            'password' => Hash::make('correct-password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@alnour.edu',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'message' => 'بيانات الدخول غير صحيحة'
        ]);
        
        // Should NOT reveal which field was wrong
        $response->assertJsonMissing(['email']);
        $response->assertJsonMissing(['password']);
    }

    /** @test */
    public function it_blocks_teacher_from_accessing_admin_routes()
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'is_active' => true,
        ]);

        $response = $this->actingAs($teacher, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    /** @test */
    public function it_blocks_parent_from_seeing_another_parents_child()
    {
        $parent1 = User::factory()->create([
            'role' => 'parent',
            'is_active' => true,
        ]);
        
        $parent2 = User::factory()->create([
            'role' => 'parent',
            'is_active' => true,
        ]);

        $student = Student::factory()->create([
            'parent_id' => $parent2->id,
        ]);

        // Parent1 trying to access Parent2's child
        $response = $this->actingAs($parent1, 'sanctum')
            ->getJson("/api/parent/students/{$student->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function it_rejects_file_upload_with_double_extension()
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'is_active' => true,
        ]);

        // Create a file with double extension
        $file = UploadedFile::fake()->create('malware.php.jpg', 100);

        $response = $this->actingAs($teacher, 'sanctum')
            ->postJson('/api/files/upload', [
                'file' => $file,
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Invalid file name. Double extensions are not allowed.'
        ]);
    }

    /** @test */
    public function it_logs_every_login_to_audit_logs()
    {
        $user = User::factory()->create([
            'email' => 'admin@alnour.edu',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@alnour.edu',
            'password' => 'Admin@123',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'login',
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_audit_log_entries()
    {
        $user = User::factory()->create();
        
        AuditLog::record('test_action', $user);
        
        $log = AuditLog::first();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Audit logs are immutable and cannot be deleted.');
        
        $log->delete();
    }

    /** @test */
    public function it_cannot_update_audit_log_entries()
    {
        $user = User::factory()->create();
        
        AuditLog::record('test_action', $user);
        
        $log = AuditLog::first();

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Audit logs are immutable and cannot be updated.');
        
        $log->update(['action' => 'modified_action']);
    }

    /** @test */
    public function it_blocks_inactive_account_login()
    {
        $user = User::factory()->create([
            'email' => 'inactive@test.com',
            'password' => Hash::make('password'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'inactive@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'message' => 'حسابك غير نشط. يرجى الاتصال بالإدارة'
        ]);
    }

    /** @test */
    public function it_logs_unauthorized_access_attempts()
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'is_active' => true,
        ]);

        $this->actingAs($teacher, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'unauthorized_access',
            'user_id' => $teacher->id,
        ]);
    }
}
