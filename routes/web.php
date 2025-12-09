<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\TaskController;

Route::get('welcome', function (Request $request) {
    return Inertia::render('greetings', ['name' => $request->get('name')]);
})->name('welcome');



Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $tasks = \App\Models\Task::all(); // Recupera tutti i task dal database
        return Inertia::render('dashboard', ['tasks' => $tasks]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
