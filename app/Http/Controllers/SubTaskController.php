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

//    return Inertia::location(url()->previous());
return redirect()->back();


}


public function destroy(SubTask $subtask)
{
    $subtask->delete();

    return redirect()->back();

    //  return Inertia::location(url()->previous());

}


}
