<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function dashboard()
    {

        $tasks = Auth::user()->tasks()->latest()->paginate(5);
        $statistc = [
            'todo' => Auth::user()->tasks()->where('completed', false)->count(),
            'done' => Auth::user()->tasks()->where('completed', true)->count(),
        ];
        return Inertia::render('dashboard', [
            'tasks' => $tasks,
            'statistc' => $statistc,
        ]);
    }

  public function dashboardActivity(Request $request)
{
    // Ottieni il termine di ricerca dalla query string
    $search = $request->input('search', '');

    // Filtro dei task in base al termine di ricerca
    $tasks = Auth::user()->tasks()
        ->when($search, function ($query, $search) {
            return $query->where('title', 'like', '%' . $search . '%')  // Filtra per titolo
                         ->orWhere('description', 'like', '%' . $search . '%'); // Filtra per descrizione
        })
        ->latest()  // Ordina per data (più recenti prima)
        ->paginate(10)  // Paginazione dei risultati (10 per pagina)
        ->withQueryString();

    // Statistiche per i task (da fare e completati)
    $statistc = [
        'todo' => Auth::user()->tasks()->where('completed', false)->count(),
        'done' => Auth::user()->tasks()->where('completed', true)->count(),
    ];

    // Passa i task e le statistiche alla vista Inertia
    return Inertia::render('dashboardActivity', [
        'tasks' => $tasks,
        'statistc' => $statistc,
        'search' => $search,  // Passa anche il termine di ricerca alla vista
    ]);
}



    public function store(Request $request)
    {
        $request->validate(['title' => 'required']);
        $taskData = $request->only('title');
        $taskData['user_id'] = Auth::user()->id;
        Task::create($taskData);

        return Inertia::location(url()->previous());

    }

    public function update(Task $task)
    {
        $task->update([
            'completed' => !$task->completed,
        ]);

        return Inertia::location(url()->previous());
    }

    public function updateTitle(Request $request, Task $task)
    {
        $request->validate(['title' => 'required']);
        $task->update(['title' => $request->input('title')]);

        return Inertia::location(url()->previous());
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return Inertia::location(url()->previous());
    }
}