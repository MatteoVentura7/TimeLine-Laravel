<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubTaskController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [TaskController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboardActivity', [TaskController::class, 'dashboardActivity'])->name('dashboardActivity');
    Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('tasks/{task}', [TaskController::class, 'updateTitle'])->name('tasks.updateTitle');
    Route::patch('tasks/{task}/toggle', [TaskController::class, 'update'])->name('tasks.toggle');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy'); 
    Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::post('/tasks/{task}/subtasks', [SubTaskController::class, 'store']);



});

require __DIR__ . '/settings.php';
