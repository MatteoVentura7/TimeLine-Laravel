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
    created_at_iso: string;
    completed_at_iso: string | null;
    expiration_iso: string | null;
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
    const [completed, setCompleted] = useState(false);
    const [completedAt, setCompletedAt] = useState('');
    const [expiration, setExpiration] = useState('');
    const [loading, setLoading] = useState(false);

    const [expirationError, setExpirationError] = useState('');
    const [completedError, setCompletedError] = useState('');

    const isoToLocal = (iso: string | null) => {
        if (!iso) return '';
        const d = new Date(iso);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60_000);
        return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    };

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setUserId(task.user?.id ?? '');
            setCompleted(task.completed);
            setCompletedAt(isoToLocal(task.completed_at_iso));
            setExpiration(isoToLocal(task.expiration_iso));
            setIsEditing(false);
            setExpirationError('');
            setCompletedError('');
        }
    }, [task]);

    const saveChanges = () => {
        if (!task) return;

        const createdAt = new Date(task.created_at_iso);
        const expDate = expiration ? new Date(expiration) : null;
        const compDate = completedAt ? new Date(completedAt) : null;

        // reset errori
        setExpirationError('');
        setCompletedError('');

        if (expDate && expDate < createdAt) {
            setExpirationError('Expiration date cannot be before creation date.');
            return;
        }

        if (compDate && compDate < createdAt) {
            setCompletedError('Completed date cannot be before creation date.');
            return;
        }

        setLoading(true);

        Inertia.patch(
            `/tasks/${task.id}`,
            {
                title,
                user_id: userId || null,
                completed,
                completed_at: completed ? completedAt : null,
                expiration: expiration || null,
            },
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
        setCompleted(task.completed);
        setCompletedAt(isoToLocal(task.completed_at_iso));
        setExpiration(isoToLocal(task.expiration_iso));
        setIsEditing(false);
        setExpirationError('');
        setCompletedError('');
    };

    if (!task) return null;

    const selectedUser = users.find(u => u.id === userId) ?? task.user;

    return (
        <Modal open={open} onClose={onClose} title="Task Details" width="w-[1200px]">
            <div className="space-y-6">
                {/* Titolo + edit */}
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

                {/* Utente assegnato */}
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

                {/* Stato completamento */}
                <div className="flex flex-wrap items-center gap-3">
                    {isEditing ? (
                        <select
                            value={completed ? 'completed' : 'pending'}
                            onChange={(e) => setCompleted(e.target.value === 'completed')}
                            className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 shadow-sm transition"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    ) : (
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                                completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            <i className={`fa-solid ${completed ? 'fa-circle-check' : 'fa-clock'}`}></i>
                            {completed ? 'Completed' : 'Pending'}
                        </span>
                    )}
                </div>

                {/* Date fields */}
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
                        {isEditing ? (
                            <>
                                <input
                                    type="datetime-local"
                                    value={expiration}
                                    onChange={(e) => setExpiration(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition"
                                />
                                {expirationError && (
                                    <p className="text-red-500 text-sm mt-1">{expirationError}</p>
                                )}
                            </>
                        ) : (
                            <p className="font-medium">{task.expiration_formatted ?? '—'}</p>
                        )}
                    </div>

                    <div className="rounded-lg border p-3 sm:col-span-2 bg-gray-50 dark:bg-neutral-800 shadow-sm transition">
                        <p className="text-sm text-gray-500">Completed on</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="datetime-local"
                                    value={completedAt}
                                    onChange={(e) => setCompletedAt(e.target.value)}
                                    disabled={!completed}
                                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition ${
                                        !completed ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                />
                                {completedError && (
                                    <p className="text-red-500 text-sm mt-1">{completedError}</p>
                                )}
                            </>
                        ) : (
                            <p className="font-medium">{task.completed_at_formatted ?? '—'}</p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
