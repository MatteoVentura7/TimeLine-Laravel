import type { SubTask, Task } from '@/types/task-user';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function SubTaskList({ task }: { task: Task }) {
    const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks);
    
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);


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

    return (
        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-neutral-800">
            <h4 className="mb-3 text-sm font-semibold">Subtasks</h4>

            <ul className="space-y-2">
                {subtasks.map((st) => (
                    <li
                        key={st.id}
                        className="group flex items-center justify-between gap-2 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <i
                                className={`fa-regular ${
                                    st.completed
                                        ? 'fa-square-check text-green-500'
                                        : 'fa-square'
                                }`}
                            />
                            <span
                                className={
                                    st.completed
                                        ? 'text-gray-400 line-through'
                                        : ''
                                }
                            >
                                {st.title}
                            </span>
                        </div>

                        <button
                            onClick={() => deleteSubTask(st.id)}
                            className="cursor-pointer"
                        >
                            <i className="fa-solid fa-trash text-red-500 hover:text-red-700" />
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
                        className="rounded-lg bg-blue-500 px-3 py-1 text-white"
                    >
                        {loading ? '...' : 'Add'}
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 cursor-pointer text-sm text-blue-600 hover:underline"
                >
                    + Add subtask
                </button>
            )}
        </div>
    );
}
