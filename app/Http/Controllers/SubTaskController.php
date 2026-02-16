<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\SubTask;
use Inertia\Inertia;

class SubTaskController extends Controller
{


    public function store(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task->subtasks()->create([
            'title' => $validated['title'],
            'completed' => false,
        ]);



        return redirect()->back();
    }


    public function destroy(SubTask $subtask)
    {
        $subtask->delete();

       
    return redirect()->route('dashboardActivity'); 
    }

    public function toggleComplete(SubTask $subtask)
    {
        $subtask->update([
            'completed' => ! $subtask->completed,
            'completed_at' => $subtask->completed ? null : now(),
        ]);

        return back();
    }

    public function info(SubTask $subtask)
    {
        return Inertia::render('subtaskInfo', [
            'subtask' => $subtask->load('task', 'task.user'),
        ]);
    }

    public function update(Request $request, SubTask $subtask)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $subtask->update([
            'title' => $validated['title'],
        ]);

        return redirect()->back();
    }
}
