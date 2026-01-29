import { useState } from 'react';
import type { Task, SubTask } from '@/types/task-user';

export default function SubTaskList({ task }: { task: Task }) {
    const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const addSubTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);

        const response = await fetch(`/tasks/${task.id}/subtasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector(
                    'meta[name="csrf-token"]'
                ) as HTMLMetaElement).content,
            },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();

        setSubtasks((prev) => [...prev, data.subtask]);
        setTitle('');
        setShowForm(false);
        setLoading(false);
    };

    return (
        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-neutral-800">
            <h4 className="mb-3 text-sm font-semibold">Subtasks</h4>

            <ul className="space-y-2">
                {subtasks.map((st) => (
                    <li key={st.id} className="flex items-center gap-2 text-sm">
                        <i
                            className={`fa-regular ${
                                st.completed
                                    ? 'fa-square-check text-green-500'
                                    : 'fa-square'
                            }`}
                        />
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
                        disabled={loading}
                    />
                    <button
                        disabled={loading}
                        className="rounded-lg bg-blue-500 px-3 py-1 text-white"
                    >
                        {loading ? '...' : 'Add'}
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    + Add subtask
                </button>
            )}
        </div>
    );
}
