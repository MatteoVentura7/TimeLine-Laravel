<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Auth; 

Route::middleware(['auth', 'verified'])->group(function () {
Route::get('welcome', function () {
  
     $tasks = Auth::user()->tasks;
     $statistc = Auth::user()->tasks->groupBy->completed->map->count();
      return Inertia::render('greetings', ['tasks' => $tasks , 'statistc' => $statistc]);
})->name('welcome');
Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('tasks/{task}/toggle', [TaskController::class, 'update'])->name('tasks.toggle');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $tasks = Auth::user()->tasks; 
        $statistc = Auth::user()->tasks->groupBy->completed->map->count();
   
       
        return Inertia::render('dashboard', ['tasks' => $tasks , 'statistc' => $statistc]);
    })->name('dashboard');

    Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('tasks/{task}/toggle', [TaskController::class, 'update'])->name('tasks.toggle');
    Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__.'/settings.php';
