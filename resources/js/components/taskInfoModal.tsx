import { router as Inertia } from '@inertiajs/core';
import { useState, useEffect } from 'react';
import Modal from './modal';

interface User {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    completed: boolean;
    created_at_formatted: string;
    completed_at_formatted: string;
    expiration_formatted: string;
    user?: User | null;
}

interface TaskInfoModalProps {
    task: Task | null;
    users: User[];
    open: boolean;
    onClose: () => void;
}

export default function TaskInfoModal({ task, users, open, onClose }: TaskInfoModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [userId, setUserId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setUserId(task.user?.id ?? '');
            setIsEditing(false);
        }
    }, [task]);

    const saveChanges = () => {
        if (!task) return;
        setLoading(true);
        Inertia.patch(
            `/tasks/${task.id}`,
            { title, user_id: userId || null },
            {
                onFinish: () => {
                    setLoading(false);
                    setIsEditing(false);
                    onClose();
                },
            }
        );
    };

    const cancelEdit = () => {
        if (!task) return;
        setTitle(task.title);
        setUserId(task.user?.id ?? '');
        setIsEditing(false);
    };

    if (!task) return null;

    const selectedUser = users.find(u => u.id === userId) ?? task.user;

    return (
        <Modal open={open} onClose={onClose} title="Task Details" width="w-[800px]">
            <div className="space-y-6">
                {/* Titolo + Edit */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 shadow-sm transition">
                    {isEditing ? (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 shadow-sm transition-all"
                            placeholder="Task title"
                        />
                    ) : (
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100 transition-all">
                            <i className="fa-solid fa-list-check text-blue-500"></i>
                            {title}
                        </h3>
                    )}

                    <div className="ml-4 flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={saveChanges}
                                    disabled={loading}
                                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                >
                                    {loading ? (
                                        <span className="animate-spin border-b-2 border-white rounded-full w-4 h-4"></span>
                                    ) : (
                                        <i className="fa-solid fa-check"></i>
                                    )}
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition flex items-center gap-1"
                            >
                                <i className="fa-solid fa-pen"></i>
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Utente assegnato con aggiornamento live */}
                <div className="flex flex-wrap items-center gap-3">
                    {isEditing ? (
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}
                            className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 shadow-sm transition"
                        >
                            <option value="">— Unassigned —</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition">
                            <i className="fa-solid fa-user"></i>
                            {selectedUser?.name ?? 'Unassigned'}
                        </span>
                    )}
                </div>

                {/* Stato live */}
                <div>
                    <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                            task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        <i className={`fa-solid ${task.completed ? 'fa-circle-check' : 'fa-clock'}`}></i>
                        {task.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>

                {/* Info date con anteprima soft */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border p-3 bg-gray-50 dark:bg-neutral-800 shadow-sm transition">
                        <p className="text-sm text-gray-500">Created at</p>
                        <p className="font-medium">
                            <i className="fa-regular fa-calendar mr-2"></i>
                            {task.created_at_formatted}
                        </p>
                    </div>

                    <div className="rounded-lg border p-3 bg-gray-50 dark:bg-neutral-800 shadow-sm transition">
                        <p className="text-sm text-gray-500">Expiration</p>
                        <p className="font-medium">{task.expiration_formatted ?? '—'}</p>
                    </div>

                    <div className="rounded-lg border p-3 sm:col-span-2 bg-gray-50 dark:bg-neutral-800 shadow-sm transition">
                        <p className="text-sm text-gray-500">Completed on</p>
                        <p className="font-medium">{task.completed_at_formatted ?? '—'}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
