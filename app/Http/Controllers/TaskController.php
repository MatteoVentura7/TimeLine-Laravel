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
            ->paginate(5);

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

        $tasks = Task::with('user')
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

        if (!empty($validated['start'])) {
            $task->created_at = Carbon::parse($validated['start']);
            $task->timestamps = false; // per modificare created_at
        }

        $task->expiration = $validated['expiration'] ?? null;
        $task->save();

        return Inertia::location(url()->previous());
    }

    /**
     * Toggle completo / undo completo
     */
    public function toggleComplete(Task $task)
    {
        $task->update([
            'completed' => !$task->completed,
            'completed_at' => $task->completed ? null : now(),
        ]);

       return Inertia::location(url()->previous());
    }

    /**
     * Aggiorna task parzialmente senza cancellare altri campi
     */
    public function updateTitle(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'completed' => 'nullable|boolean',
            'completed_at' => 'nullable|date',
            'expiration' => 'nullable|date',
            'created_at' => 'nullable|date',
        ]);

        $data = [];

        if (isset($validated['title'])) $data['title'] = $validated['title'];
        if (isset($validated['user_id'])) $data['user_id'] = $validated['user_id'];
        if (isset($validated['completed'])) $data['completed'] = $validated['completed'];
        if (isset($validated['completed_at'])) $data['completed_at'] = Carbon::parse($validated['completed_at']);
        if (isset($validated['expiration'])) $data['expiration'] = Carbon::parse($validated['expiration']);
        if (isset($validated['created_at'])) {
            $task->timestamps = false;
            $data['created_at'] = Carbon::parse($validated['created_at']);
        }

        $task->update($data);

         return Inertia::location(url()->previous());
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return Inertia::location(url()->previous());
    }

    /**
     * Completa task con data inserita dalla modal
     */
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
