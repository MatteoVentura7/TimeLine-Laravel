<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TaskController extends Controller
{
    
    public function dashboard()
    {
        
         $tasks = Task::with('user') 
            ->latest()
            ->paginate(5)
           ;

           $statistc = [
            'todo' => Task::where('completed', false)->count(),
            'done' => Task::where('completed', true)->count(),
        ];

        return Inertia::render('dashboard', [
            'tasks' => $tasks,
            'statistc' => $statistc,
            'users' => User::select('id', 'name')->get(), 
        ]);
    }

    
    public function dashboardActivity(Request $request)
    {
        $search = $request->input('search', '');

        $tasks = Task::with('user') // Carica relazione utente
            ->when($search, function ($query, $search) {
                return $query->where('title', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $statistc = [
            'todo' => Task::where('completed', false)->count(),
            'done' => Task::where('completed', true)->count(),
        ];

        return Inertia::render('dashboardActivity', [
            'tasks' => $tasks,
            'statistc' => $statistc,
            'search' => $search,
            'users' => User::select('id', 'name')->get(),
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'user_id' => 'nullable|exists:users,id',
        'start' => 'nullable|date',
        'expiration' => 'nullable|date|after_or_equal:start',
    ], [
        'expiration.after_or_equal' =>
            'La data di fine non può essere precedente alla data di inizio.',
    ]);

    $task = new Task();
    $task->title = $validated['title'];
    $task->user_id = $validated['user_id'] ?? Auth::id();

    $hasCustomStart = !empty($validated['start']);

    if ($hasCustomStart) {
        $task->created_at = Carbon::parse($validated['start']);
    }


    
    if ($hasCustomStart) {
        $task->timestamps = false;
    }

    $task->expiration = $validated['expiration'] ?? null;

    $task->save();

    return Inertia::location(url()->previous());
}
    public function update(Task $task)
    {
        $task->update([
            'completed' => !$task->completed,
            'completed_at' => $task->completed ? null : now(), 
        ]);

        return Inertia::location(url()->previous());
    }

    
public function updateTitle(Request $request, Task $task)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'user_id' => 'nullable|exists:users,id',
    ]);

    $task->update([
        'title' => $validated['title'],
        'user_id' => $validated['user_id'] ?? $task->user_id,
    ]);

    return Inertia::location(url()->previous());
}


   
    public function destroy(Task $task)
    {
        $task->delete();

        return Inertia::location(url()->previous());
    }

  

public function complete(Request $request, Task $task)
{
    $request->validate([
        'completed_at' => [
            'required',
            'date',
            function ($attribute, $value, $fail) use ($task) {
                $completedAt = Carbon::parse($value);
                if ($completedAt->lt($task->created_at)) {
                    $fail('La data e ora di completamento non può essere precedente a quella di creazione.');
                }
                if ($completedAt->gt(now())) {
                    $fail('La data e ora di completamento non può essere nel futuro.');
                }
            },
        ],
    ]);

    $task->update([
        'completed' => true,
        'completed_at' => Carbon::parse($request->completed_at),
    ]);

    return back();
}




}
