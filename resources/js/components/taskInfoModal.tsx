import { router as Inertia } from '@inertiajs/core';
import { useEffect, useState } from 'react';
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

export default function TaskInfoModal({
    task,
    users,
    open,
    onClose,
}: TaskInfoModalProps) {
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
            setExpirationError(
                'Expiration date cannot be before creation date.',
            );
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
            },
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

    const selectedUser = users.find((u) => u.id === userId) ?? task.user;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Task Details"
            width="w-[1200px]"
        >
            <div className="space-y-6">
                {/* Titolo + edit */}
                <div className="ml-4 flex items-center justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={saveChanges}
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-green-500 px-3 py-1 text-white transition hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            >
                                {loading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                                ) : (
                                    <i className="fa-solid fa-check"></i>
                                )}
                                Save
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-200 px-3 py-1 text-gray-700 transition hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1 text-yellow-700 transition hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                        >
                            <i className="fa-solid fa-pen"></i>
                            Edit
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm transition dark:bg-neutral-700">
                    {isEditing ? (
                        <>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                                <i className="fa-solid fa-list-check text-blue-500"></i>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Task title"
                                />
                            </h3>
                        </>
                    ) : (
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                            <i className="fa-solid fa-list-check text-blue-500"></i>
                            {title}
                        </h3>
                    )}
                </div>

                {/* Utente assegnato + stato completamento*/}
                <div className="flex flex-wrap items-center gap-3">
                    {isEditing ? (
                        <>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition">
                            <i className="fa-solid fa-user"></i>
                             <select
                            value={userId}
                            onChange={(e) =>
                                setUserId(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : '',
                                )
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                            
                        </span>
                       
                        </>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition">
                            <i className="fa-solid fa-user"></i>
                            {selectedUser?.name ?? 'Unassigned'}
                        </span>
                    )}
                    {isEditing ? (
                        <>
                           <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                                completed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            <i
                                className={`fa-solid ${completed ? 'fa-circle-check' : 'fa-clock'}`}
                            ></i>
                            
                            <select
                            value={completed ? 'completed' : 'pending'}
                            onChange={(e) =>
                                setCompleted(e.target.value === 'completed')
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                        </span>
                        
                        </>
                    ) : (
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                                completed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            <i
                                className={`fa-solid ${completed ? 'fa-circle-check' : 'fa-clock'}`}
                            ></i>
                            {completed ? 'Completed' : 'Pending'}
                        </span>
                    )}
                </div>

                {/* Date fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border bg-gray-50 p-3 shadow-sm transition dark:bg-neutral-800">
                        <p className="text-sm text-gray-500">Created at</p>
                        <p className="font-medium">
                            <i className="fa-regular fa-calendar mr-2"></i>
                            {task.created_at_formatted}
                        </p>
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-3 shadow-sm transition dark:bg-neutral-800">
                        <p className="text-sm text-gray-500">Expiration</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="datetime-local"
                                    value={expiration}
                                    onChange={(e) =>
                                        setExpiration(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                {expirationError && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {expirationError}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="font-medium">
                                {task.expiration_formatted ?? '—'}
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-3 shadow-sm transition sm:col-span-2 dark:bg-neutral-800">
                        <p className="text-sm text-gray-500">Completed on</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="datetime-local"
                                    value={completedAt}
                                    onChange={(e) =>
                                        setCompletedAt(e.target.value)
                                    }
                                    disabled={!completed}
                                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                        !completed
                                            ? 'cursor-not-allowed bg-gray-100'
                                            : ''
                                    }`}
                                />
                                {completedError && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {completedError}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="font-medium">
                                {task.completed_at_formatted ?? '—'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
