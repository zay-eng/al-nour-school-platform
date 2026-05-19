<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->decimal('score', 5, 2);
            $table->decimal('max_score', 5, 2)->default(20);
            $table->enum('term', ['T1', 'T2', 'T3']);
            $table->enum('type', ['devoir', 'composition', 'oral', 'projet', 'examen']);
            $table->string('title', 200);
            $table->date('graded_at');
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'subject_id', 'term']);
            $table->index('teacher_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
