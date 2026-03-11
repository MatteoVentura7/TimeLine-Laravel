<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskFileController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:20480', // 20MB max per file
        ]);

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $storedName   = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path         = $file->storeAs('task-files', $storedName, 'local');

            TaskFile::create([
                'task_id'       => $task->id,
                'original_name' => $originalName,
                'stored_name'   => $storedName,
                'path'          => $path,
                'mime_type'     => $file->getMimeType(),
                'size'          => $file->getSize(),
            ]);
        }

        return redirect()->back();
    }

    public function download(TaskFile $taskFile)
    {
        if (!Storage::disk('local')->exists($taskFile->path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('local')->download($taskFile->path, $taskFile->original_name);
    }

    public function destroy(TaskFile $taskFile)
    {
        Storage::disk('local')->delete($taskFile->path);
        $taskFile->delete();

        return redirect()->back();
    }
}
