<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action', 100)->index();
            $table->string('model_type', 255)->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            // No updated_at — logs are immutable
            $table->index(['model_type', 'model_id']);
            $table->index('created_at');
        });
        
        // PostgreSQL rules to prevent updates and deletes
        if (config('database.default') === 'pgsql') {
            DB::statement('CREATE RULE no_delete_audit AS ON DELETE TO audit_logs DO INSTEAD NOTHING');
            DB::statement('CREATE RULE no_update_audit AS ON UPDATE TO audit_logs DO INSTEAD NOTHING');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (config('database.default') === 'pgsql') {
            DB::statement('DROP RULE IF EXISTS no_delete_audit ON audit_logs');
            DB::statement('DROP RULE IF EXISTS no_update_audit ON audit_logs');
        }
        
        Schema::dropIfExists('audit_logs');
    }
};
