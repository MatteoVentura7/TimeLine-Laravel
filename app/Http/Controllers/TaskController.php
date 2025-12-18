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
        $tasks = Auth::user()->tasks;
        $statistc = $tasks->groupBy('completed')->map->count();
        return Inertia::render('dashboard', [
            'tasks' => $tasks,
            'statistc' => $statistc,
        ]);
    }

    public function dashboardActivity()
    {
        $tasks = Auth::user()->tasks;
        $statistc = $tasks->groupBy('completed')->map->count();
        return Inertia::render('dashboardActivity', [
            'tasks' => $tasks,
            'statistc' => $statistc,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate(['title' => 'required']);
        $taskData = $request->only('title');
        $taskData['user_id'] = Auth::user()->id;
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