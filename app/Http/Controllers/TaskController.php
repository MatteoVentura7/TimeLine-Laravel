<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
        $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id', 
        ]);

        $taskData = $request->only('title', 'user_id');

        
        $taskData['user_id'] = $taskData['user_id'] ?? Auth::id();

        Task::create($taskData);

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
}
