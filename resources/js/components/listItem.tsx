import { router as Inertia } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Task {
    id: number;
    title: string;
    completed: boolean;
}



export default function ListItem({ tasks = [], showEdit = false }: { tasks: Task[]; showEdit?: boolean }) {
    const { patch } = useForm({ title: '' });
    const [isCheck, setIsCheck] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Inline edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const saveEdit = (id: number) => {
        setIsSaving(true);
        Inertia.patch(`/tasks/${id}`, { title: editTitle }, {
            onFinish: () => {
                setIsSaving(false);
                setEditingId(null);
                setEditTitle('');
            },
        });
    };

    const toggle = (id: number) => {
        setIsCheck(true);
        patch(`/tasks/${id}/toggle`, {
            onFinish: () => setIsCheck(false),
        });
    }; 

    const remove = (id: number) => {
        setTaskToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete) return;
        setIsDeleting(true);
        Inertia.delete(`/tasks/${taskToDelete}`, {
            onFinish: () => {
                setConfirmOpen(false);
                setTaskToDelete(null);
                setIsDeleting(false);
            },
        });
    };

    return (
        <div className="flex h-full flex-col">
            {tasks.length === 0 ? (
                <div className="animate-fadeInUp mt-6 flex flex-col items-center justify-center">
                    <img src="9264828.jpg" className="max-w-36 opacity-90" />
                    <p className="mt-4 text-xl text-gray-500">
                        No activity found 🎉
                    </p>
                </div>
            ) : (
                <>
                    <ul className="m-4 max-h-220 grow space-y-3 p-0 pr-2 pb-2">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex items-center justify-between rounded-xl bg-white p-4 shadow hover:shadow-lg dark:bg-neutral-800"
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        disabled={isCheck}
                                        checked={task.completed}
                                        onChange={() => toggle(task.id)}
                                        className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-400"
                                    />
                                    {editingId === task.id ? (
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEdit(task.id);
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                            autoFocus
                                            className="w-64 rounded border px-2 py-1"
                                        />
                                    ) : (
                                        <span
                                            className={`font-medium text-gray-800 transition-colors duration-200 dark:text-gray-200 ${
                                                task.completed
                                                    ? 'text-gray-400 line-through dark:text-gray-500'
                                                    : ''
                                            }`}
                                        >
                                            {task.title}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {showEdit && (
                                        editingId === task.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(task.id)}
                                                    disabled={isSaving}
                                                    className="mr-2 cursor-pointer text-green-500 hover:text-green-600"
                                                    title="Save"
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="mr-3 cursor-pointer text-gray-500 hover:text-gray-600"
                                                    title="Cancel"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(task)}
                                                className="mr-3 cursor-pointer text-yellow-500 hover:text-yellow-600"
                                                title="Edit task"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => remove(task.id)}
                                        className="cursor-pointer text-red-500 hover:text-red-600"
                                        title="Delete task"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button> 
                                   
                                </div>
                            </li>
                        ))}
                    </ul>

               
                </>
            )}

            {/* POPUP CONFERMA ELIMINAZIONE */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl dark:bg-neutral-900">
                        <h2 className="mb-4 text-xl font-semibold">
                            Confirm delete
                        </h2>
                        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                            Are you sure you want to delete this task?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                disabled={isDeleting}
                                className="cursor-pointer rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
