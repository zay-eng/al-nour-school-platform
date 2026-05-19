<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\FileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes with rate limiting
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    
    // File routes
    Route::post('/files/upload', [FileController::class, 'upload']);
    Route::get('/files/{path}', [FileController::class, 'serve'])->where('path', '.*');
    
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Admin dashboard']);
        });
    });

    // Parent routes
    Route::middleware('role:parent')->prefix('parent')->group(function () {
        Route::get('/students/{id}', [StudentController::class, 'show']);
        Route::get('/students', [StudentController::class, 'index']);
    });

    // Payment routes - Administrator only
    Route::middleware('role:admin')->prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/statistics', [PaymentController::class, 'statistics']);
        Route::get('/export', [PaymentController::class, 'export']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{id}', [PaymentController::class, 'show']);
        Route::put('/{id}', [PaymentController::class, 'update']);
        Route::delete('/{id}', [PaymentController::class, 'destroy']);
    });
});
