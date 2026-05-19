<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user = Auth::user();

        // Check if account is active
        if (!$user->is_active) {
            // Log inactive account access
            AuditLog::record('inactive_account_access', $user, [], [
                'attempted_url' => $request->url(),
            ]);
            
            // Logout the user
            Auth::logout();
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => false,
                'message' => 'Account deactivated.'
            ], 403);
        }

        // Check if user has required role
        if (!in_array($user->role, $roles)) {
            // Log unauthorized access attempt
            AuditLog::recordUnauthorizedAccess(
                $request->url(),
                $user->role,
                $roles
            );
            
            return response()->json([
                'success' => false,
                'message' => 'Forbidden.'
            ], 403);
        }

        return $next($request);
    }
}
