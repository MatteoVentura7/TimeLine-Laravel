import { useState } from 'react';
import { router } from '@inertiajs/core';
import type { Task } from '@/types/task-user';

export default function SubTaskList({ task }: { task: Task }) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');

    const addSubTask = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(`/tasks/${task.id}/subtasks`, { title }, {
            onSuccess: () => {
                setTitle('');
                setShowForm(false);
            },
        });
    };

    return (
        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-neutral-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Subtasks
            </h4>

            <ul className="space-y-2">
                {task.subtasks.map((st) => (
                    <li key={st.id} className="flex items-center gap-2 text-sm">
                        <i
                            className={`fa-regular ${
                                st.completed
                                    ? 'fa-square-check text-green-500'
                                    : 'fa-square'
                            }`}
                        ></i>
                        {st.title}
                    </li>
                ))}
            </ul>

            {showForm ? (
                <form onSubmit={addSubTask} className="mt-3 flex gap-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 rounded-lg border px-3 py-1 text-sm"
                        placeholder="New subtask"
                    />
                    <button className="rounded-lg bg-blue-500 px-3 py-1 text-white">
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-sm text-gray-500"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                >
                    + Add subtask
                </button>
            )}
        </div>
    );
}
