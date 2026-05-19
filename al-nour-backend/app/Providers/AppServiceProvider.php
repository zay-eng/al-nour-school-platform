<?php

namespace App\Providers;

use App\Models\AuditLog;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        // Login rate limiter: 5 attempts per 15 minutes per email+IP combination
        RateLimiter::for('login', function (Request $request) {
            $key = $request->input('email') . '|' . $request->ip();
            
            return Limit::perMinutes(15, 5)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    $retryAfter = $headers['Retry-After'] ?? 900; // 15 minutes in seconds
                    
                    // Log the lockout event
                    AuditLog::create([
                        'user_id' => null,
                        'action' => 'account_locked',
                        'model_type' => null,
                        'model_id' => null,
                        'old_values' => null,
                        'new_values' => [
                            'email' => $request->input('email'),
                            'reason' => 'Too many login attempts',
                            'retry_after_seconds' => $retryAfter,
                        ],
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'created_at' => now(),
                    ]);
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'Too many attempts. Try again in 15 minutes.',
                        'retry_after' => $retryAfter,
                    ], 429);
                });
        });

        // API rate limiter: 60 requests per minute per user or IP
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Too many requests. Please slow down.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429);
                });
        });

        // Strict rate limiter for sensitive operations (password reset, etc.)
        RateLimiter::for('sensitive', function (Request $request) {
            return Limit::perHour(3)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Too many sensitive operations. Try again later.',
                        'retry_after' => $headers['Retry-After'] ?? 3600,
                    ], 429);
                });
        });
    }
}
