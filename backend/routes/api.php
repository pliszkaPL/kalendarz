<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
