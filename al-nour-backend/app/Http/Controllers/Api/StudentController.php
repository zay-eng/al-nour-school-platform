<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Get student details (parent can only see their own children).
     */
    public function show($id)
    {
        $user = auth('sanctum')->user();
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        // Parent can only see their own children
        if ($user->role === 'parent' && $student->parent_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You can only access your own children.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'student' => $student
        ]);
    }

    /**
     * Get all students for the authenticated parent.
     */
    public function index()
    {
        $user = auth('sanctum')->user();

        if ($user->role === 'parent') {
            $students = Student::where('parent_id', $user->id)->get();
        } else {
            // Admin and teachers can see all students
            $students = Student::all();
        }

        return response()->json([
            'success' => true,
            'students' => $students
        ]);
    }
}
