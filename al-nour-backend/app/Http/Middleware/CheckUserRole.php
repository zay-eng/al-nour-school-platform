<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request with role-based access control.
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
            // Log out the user immediately
            Auth::logout();
            
            // Log the attempt
            AuditLog::record('account_deactivated_access_attempt', $user);
            
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
