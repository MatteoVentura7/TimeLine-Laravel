import type { SubTask, Task } from '@/types/task-user';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function SubTaskList({ task }: { task: Task }) {
    const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSubtasks(task.subtasks);
    }, [task.subtasks]);

    const addSubTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const tempId = Date.now();

        const optimisticSubtask: SubTask = {
            id: tempId,
            title,
            completed: false,
        };

        setSubtasks((prev) => [...prev, optimisticSubtask]);
        setTitle('');
        setShowForm(false);
        setOpen(true);
        setLoading(true);

        router.post(
            `/tasks/${task.id}/subtasks`,
            { title },
            {
                preserveScroll: true,
                onError: () => {
                    setSubtasks((prev) =>
                        prev.filter((st) => st.id !== tempId),
                    );
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    const deleteSubTask = (id: number) => {
        const previous = subtasks;
        setSubtasks((prev) => prev.filter((st) => st.id !== id));

        router.delete(`/subtasks/${id}`, {
            preserveScroll: true,
            onError: () => {
                setSubtasks(previous);
            },
        });
    };

    const toggleSubTask = (id: number) => {
        const previous = subtasks;

        setSubtasks((prev) =>
            prev.map((st) =>
                st.id === id ? { ...st, completed: !st.completed } : st,
            ),
        );

        router.patch(`/subtasks/${id}/toggle`, {}, {
            preserveScroll: true,
            onError: () => {
                setSubtasks(previous);
            },
        });
    };

    return (
        <div className="rounded-lg border bg-gray-50 dark:bg-neutral-800">
            {/* ACCORDION HEADER */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between p-4 text-sm font-semibold"
            >
                <span>Subtasks ({subtasks.length})</span>

                <i
                    className={`fa-solid fa-chevron-down transition-transform duration-200 cursor-pointer ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* ACCORDION BODY */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    open ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 pb-4">
                    <ul className="space-y-2">
                        {subtasks.map((st) => (
                            <li
                                key={st.id}
                                className="flex items-center justify-between gap-2 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <i
                                        onClick={() => toggleSubTask(st.id)}
                                        className={`fa-regular cursor-pointer ${
                                            st.completed
                                                ? 'fa-square-check text-green-500'
                                                : 'fa-square'
                                        }`}
                                    />
                                    <span>{st.title}</span>
                                </div>

                                <button onClick={() => deleteSubTask(st.id)}>
                                    <i className="fa-solid fa-trash text-red-500 hover:text-red-700 cursor-pointer" />
                                </button>
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
                                className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                {loading ? '...' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg bg-gray-500 px-3 py-1 text-white hover:bg-gray-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 cursor-pointer"
                        >
                            + Add subtask
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
