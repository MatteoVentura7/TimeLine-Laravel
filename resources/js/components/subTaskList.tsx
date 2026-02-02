import { useState } from 'react';
import type { Task, SubTask } from '@/types/task-user';
import { router } from '@inertiajs/react';



export default function SubTaskList({ task }: { task: Task }) {
   
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

   

    const addSubTask = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(`/tasks/${task.id}/subtasks`, {
            title,
        });
    };

    const deleteSubTask = (id: number) => {
        router.delete(`/subtasks/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-neutral-800">
            <h4 className="mb-3 text-sm font-semibold">Subtasks</h4>

            <ul className="space-y-2">
                {task.subtasks.map((st) => (
                    <li
    key={st.id}
    className="group flex items-center justify-between gap-2 text-sm"
>
    <div
        className="flex cursor-pointer items-center gap-2"
       
    >
        <i
            className={`fa-regular ${
                st.completed
                    ? 'fa-square-check text-green-500'
                    : 'fa-square'
            }`}
        />
        <span className={st.completed ? 'line-through text-gray-400' : ''}>
            {st.title}
        </span>
    </div>

    <button
        onClick={() => deleteSubTask(st.id)}
        className='cursor-pointer'
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
                    className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    + Add subtask
                </button>
            )}
        </div>
    );
}
