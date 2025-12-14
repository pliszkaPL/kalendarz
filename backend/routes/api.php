<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CalendarController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Calendar sync endpoint
    Route::post('/calendar/sync', [CalendarController::class, 'sync']);
});

// Debug route - remove after testing
Route::middleware('auth:sanctum')->post('/calendar/debug', function (Request $request) {
    return response()->json([
        'received' => $request->all(),
        'entries_sample' => $request->input('entries.0'),
        'groups_sample' => $request->input('groups.0'),
    ]);
});
