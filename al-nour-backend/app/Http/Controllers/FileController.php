<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Serve a private file with authentication and authorization.
     *
     * @param Request $request
     * @param string $path
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function serve(Request $request, string $path)
    {
        // Verify user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();
        $fullPath = 'private/' . $path;

        // Check if file exists
        if (!Storage::exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Verify user has permission to access this file
        // This is a simplified check - implement proper ownership verification
        $canAccess = $this->verifyFileAccess($user, $path);
        
        if (!$canAccess) {
            AuditLog::record('unauthorized_file_access', null, [], [
                'file_path' => $path,
                'user_role' => $user->role,
            ]);
            
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Log file download
        AuditLog::record('document_downloaded', null, [], [
            'file_path' => $path,
        ]);

        // Get file MIME type
        $mimeType = Storage::mimeType($fullPath);
        
        // Stream the file with correct headers
        return Storage::download($fullPath, basename($path), [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . basename($path) . '"',
        ]);
    }

    /**
     * Upload a file with security checks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:pdf,jpg,jpeg,png,webp,xlsx,docx'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();

        // Reject double-extension files (e.g., file.php.jpg)
        if (substr_count($originalName, '.') > 1) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file name. Double extensions are not allowed.'
            ], 422);
        }

        // Generate UUID filename
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        
        // Store file in private storage
        $path = $file->storeAs('private/uploads', $filename);

        // Validate MIME type server-side after upload
        $mimeType = Storage::mimeType($path);
        $allowedMimes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!in_array($mimeType, $allowedMimes)) {
            // Delete the file if MIME type is invalid
            Storage::delete($path);
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid file type.'
            ], 422);
        }

        // Log file upload
        AuditLog::record('file_uploaded', null, [], [
            'filename' => $filename,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'size' => $file->getSize(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'data' => [
                'filename' => $filename,
                'path' => $path,
                'size' => $file->getSize(),
                'mime_type' => $mimeType,
            ]
        ], 201);
    }

    /**
     * Verify if user has access to the file.
     *
     * @param \App\Models\User $user
     * @param string $path
     * @return bool
     */
    private function verifyFileAccess($user, string $path): bool
    {
        // Admin has access to all files
        if ($user->isAdmin()) {
            return true;
        }

        // Teachers can access their own resources
        if ($user->isTeacher()) {
            $resource = Resource::where('file_path', 'like', '%' . basename($path))->first();
            if ($resource && $resource->teacher_id === $user->id) {
                return true;
            }
        }

        // Parents can access documents related to their children
        if ($user->isParent()) {
            // Implement parent-specific access logic
            // Check if document belongs to their child
            return true; // Simplified for now
        }

        return false;
    }
}
