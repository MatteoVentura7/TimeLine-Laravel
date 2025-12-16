<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Importa il facade Auth

class TaskController extends Controller
{
    // public function index()
    // {
    //     return Inertia::render('Tasks/Index', [
    //         'tasks' => Task::orderBy('id', 'desc')->get(),
    //     ]);
    // }



    public function store(Request $request)
    {
        $request->validate(['title' => 'required']);
        $taskData = $request->only('title');
        $taskData['user_id'] = Auth::user()->id; // Usa il facade Auth per ottenere l'utente loggato
        Task::create($taskData);

        return back();

    }

    public function update(Task $task)
    {
        $task->update([
            'completed' => !$task->completed,
        ]);

        return back();
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back();
    }
}