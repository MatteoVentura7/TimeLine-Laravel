<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\SubTask;

class SubTaskController extends Controller
{
  public function store(Request $request, Task $task)
{
    $request->validate([
        'title' => 'required|string|max:255',
    ]);

    $subtask = $task->subtasks()->create([
        'title' => $request->title,
        'completed' => false,
    ]);

    return response()->json([
        'subtask' => $subtask,
    ]);
}



public function destroy(SubTask $subtask)
{
    $subtask->delete();

    return redirect()->back();

}


}
