<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    // Dashboard principale (mostra solo i task dell'utente loggato)
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
            'users' => User::select('id', 'name')->get(), // elenco utenti per assegnazione
        ]);
    }

    // Dashboard activity con ricerca e paginazione
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

    // Salva un nuovo task
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id', // assegnazione opzionale
        ]);

        $taskData = $request->only('title', 'user_id');

        // Se non viene passato user_id, assegna al loggato
        $taskData['user_id'] = $taskData['user_id'] ?? Auth::id();

        Task::create($taskData);

        return Inertia::location(url()->previous());
    }

    // Toggle completamento task
    public function update(Task $task)
    {
        $task->update([
            'completed' => !$task->completed,
            'completed_at' => $task->completed ? null : now(), // Carbon::now()
        ]);

        return Inertia::location(url()->previous());
    }

    // Aggiorna titolo task
    public function updateTitle(Request $request, Task $task)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $task->update(['title' => $request->input('title')]);

        return Inertia::location(url()->previous());
    }

    // Cancella task
    public function destroy(Task $task)
    {
        $task->delete();

        return Inertia::location(url()->previous());
    }
}
