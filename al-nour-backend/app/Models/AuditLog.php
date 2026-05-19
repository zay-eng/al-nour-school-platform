<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Request;

class AuditLog extends Model
{
    /**
     * Audit logs are immutable - no updates allowed.
     * Only created_at timestamp, no updated_at.
     */
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Prevent updates to audit logs - they are immutable.
     *
     * @throws \Exception
     */
    public function update(array $attributes = [], array $options = []): bool
    {
        throw new \Exception('Audit logs are immutable and cannot be updated.');
    }

    /**
     * Prevent deletion of audit logs - they are immutable.
     *
     * @throws \Exception
     */
    public function delete(): ?bool
    {
        throw new \Exception('Audit logs are immutable and cannot be deleted.');
    }

    /**
     * Prevent force deletion of audit logs.
     *
     * @throws \Exception
     */
    public function forceDelete(): ?bool
    {
        throw new \Exception('Audit logs are immutable and cannot be deleted.');
    }

    /**
     * Static helper method to record an audit log entry.
     *
     * @param string $action The action being performed (e.g., 'login', 'create', 'update')
     * @param Model|null $model The model being acted upon (optional)
     * @param array $old Previous state of the model (for updates/deletes)
     * @param array $new New state of the model (for creates/updates)
     * @return void
     */
    public static function record(
        string $action,
        $model = null,
        array $old = [],
        array $new = []
    ): void {
        try {
            // If $model is a User and action is 'login', use that user's ID
            $userId = auth()->id();
            if ($action === 'login' && $model instanceof User) {
                $userId = $model->id;
            }
            
            static::create([
                'user_id' => $userId,
                'action' => $action,
                'model_type' => $model ? get_class($model) : null,
                'model_id' => $model?->getKey(),
                'old_values' => !empty($old) ? $old : null,
                'new_values' => !empty($new) ? $new : null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Log the error but don't break the application
            \Log::error('Failed to create audit log', [
                'action' => $action,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Record a failed login attempt (no user_id).
     *
     * @param string $email The email attempted
     * @param array $context Additional context
     * @return void
     */
    public static function recordFailedLogin(string $email, array $context = []): void
    {
        try {
            static::create([
                'user_id' => null,
                'action' => 'login_failed',
                'model_type' => null,
                'model_id' => null,
                'old_values' => null,
                'new_values' => array_merge(['email' => $email], $context),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to log failed login attempt', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Record an unauthorized access attempt.
     *
     * @param string $url The URL attempted
     * @param string $userRole The user's role
     * @param array $requiredRoles The roles required
     * @return void
     */
    public static function recordUnauthorizedAccess(
        string $url,
        string $userRole,
        array $requiredRoles
    ): void {
        try {
            static::create([
                'user_id' => auth()->id(),
                'action' => 'unauthorized_access',
                'model_type' => null,
                'model_id' => null,
                'old_values' => null,
                'new_values' => [
                    'attempted_url' => $url,
                    'user_role' => $userRole,
                    'required_roles' => $requiredRoles,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to log unauthorized access', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
