<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token.
     */
    public function login(Request $request)
    {
        // Rate limiting: 5 attempts per 15 minutes per email+IP
        $key = 'login-attempts:' . $request->input('email') . '|' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);
            
            // Log account lockout
            AuditLog::record('account_locked', null, [], [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
                'retry_after_seconds' => $seconds,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'محاولات تسجيل دخول كثيرة جداً. يرجى المحاولة بعد ' . $minutes . ' دقيقة.',
                'retry_after' => $seconds
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ], [
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key, 900); // 15 minutes
            
            // Log failed validation
            AuditLog::recordFailedLogin($request->input('email'), [
                'reason' => 'validation_failed',
                'errors' => $validator->errors()->toArray(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // GENERIC ERROR MESSAGE - never reveal which field is wrong
        $genericError = 'These credentials do not match our records.';
        $genericErrorAr = 'بيانات الدخول غير صحيحة';

        // Check if user exists
        if (!$user) {
            RateLimiter::hit($key, 900); // 15 minutes
            
            // Log failed login - user not found
            AuditLog::recordFailedLogin($request->email, [
                'reason' => 'user_not_found',
            ]);
            
            // Exponential backoff: add delay after 3 failures
            if (RateLimiter::attempts($key) >= 3) {
                sleep(2);
            }
            
            return response()->json([
                'success' => false,
                'message' => $genericErrorAr
            ], 401);
        }

        // Check if account is active BEFORE password verification
        if (!$user->is_active) {
            RateLimiter::hit($key, 900);
            
            // Log inactive account access attempt
            AuditLog::record('inactive_account_access', $user, [], [
                'email' => $request->email,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'حسابك غير نشط. يرجى الاتصال بالإدارة'
            ], 403);
        }

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 900);
            
            // Log failed password attempt
            AuditLog::recordFailedLogin($request->email, [
                'reason' => 'wrong_password',
                'user_id' => $user->id,
            ]);
            
            // Exponential backoff: add delay after 3 failures
            if (RateLimiter::attempts($key) >= 3) {
                sleep(2);
            }
            
            return response()->json([
                'success' => false,
                'message' => $genericErrorAr
            ], 401);
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        // Regenerate session to prevent session fixation (if session is available)
        try {
            $request->session()->regenerate();
        } catch (\Exception $e) {
            // Session not available in stateless API context - this is fine
        }

        // Log successful login
        AuditLog::record('login', $user, [], [
            'email' => $request->email,
        ]);

        // Update last login info
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Create token
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
            ]
        ]);
    }

    /**
     * Register a new user (disabled for security - only admins can create users).
     */
    public function register(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'التسجيل معطل. يرجى الاتصال بالإدارة لإنشاء حساب جديد'
        ], 403);
    }

    /**
     * Get the authenticated User.
     */
    public function me()
    {
        $user = auth('sanctum')->user();
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'address' => $user->address,
                'photo' => $user->photo,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at,
            ]
        ]);
    }

    /**
     * Log the user out (Revoke the token).
     */
    public function logout(Request $request)
    {
        // Log logout
        AuditLog::record('logout', $request->user());
        
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    /**
     * Log the user out from all devices (Revoke all tokens).
     */
    public function logoutAll(Request $request)
    {
        // Revoke all tokens
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج من جميع الأجهزة بنجاح'
        ]);
    }

    /**
     * Refresh a token (not needed with Sanctum - tokens don't expire by default).
     */
    public function refresh()
    {
        return response()->json([
            'success' => false,
            'message' => 'تحديث الرمز غير مطلوب مع Sanctum'
        ], 400);
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:10',
                'confirmed',
                'different:current_password',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
        ], [
            'current_password.required' => 'كلمة المرور الحالية مطلوبة',
            'new_password.required' => 'كلمة المرور الجديدة مطلوبة',
            'new_password.min' => 'كلمة المرور الجديدة يجب أن تكون 10 أحرف على الأقل',
            'new_password.confirmed' => 'تأكيد كلمة المرور غير متطابق',
            'new_password.different' => 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية',
            'new_password.regex' => 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth('sanctum')->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'كلمة المرور الحالية غير صحيحة'
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        // Revoke all other tokens for security
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تغيير كلمة المرور بنجاح'
        ]);
    }

    /**
     * Get the token array structure (removed - not needed with Sanctum).
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()
        ]);
    }
}
