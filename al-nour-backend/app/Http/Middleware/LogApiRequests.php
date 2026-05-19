<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    /**
     * Handle an incoming request and log it for security auditing.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Log request
        $this->logRequest($request);
        
        $response = $next($request);
        
        // Log response
        $this->logResponse($request, $response, $startTime);
        
        return $response;
    }
    
    /**
     * Log the incoming request.
     */
    private function logRequest(Request $request): void
    {
        $user = $request->user();
        
        Log::channel('api')->info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $user ? $user->id : null,
            'user_role' => $user ? $user->role : null,
            'timestamp' => now()->toDateTimeString(),
        ]);
    }
    
    /**
     * Log the response.
     */
    private function logResponse(Request $request, Response $response, float $startTime): void
    {
        $duration = round((microtime(true) - $startTime) * 1000, 2);
        
        $logLevel = $response->getStatusCode() >= 400 ? 'warning' : 'info';
        
        Log::channel('api')->{$logLevel}('API Response', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'timestamp' => now()->toDateTimeString(),
        ]);
        
        // Log suspicious activity
        if ($response->getStatusCode() === 401 || $response->getStatusCode() === 403) {
            Log::channel('security')->warning('Unauthorized Access Attempt', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => $response->getStatusCode(),
                'timestamp' => now()->toDateTimeString(),
            ]);
        }
    }
}
