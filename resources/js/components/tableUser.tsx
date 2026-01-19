import { router as Inertia } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';


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
    user?: User | null;
}

export default function TableUser({
    tasks = [],
    users,
    showEdit = false,
    onEditChange,
}: {
    tasks: Task[];
    users: User[];
    showEdit?: boolean;
    onEditChange?: (value: boolean) => void;
}) {
  const { patch } = useForm({ title: '' });

    const { data, setData, reset } = useForm<{
        user_id: number | '';
    }>({
        user_id: '',
    });

    const [isCheck, setIsCheck] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Inline edit
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isEditing = editingId !== null;

    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setData('user_id', task.user?.id ?? '');
        onEditChange?.(true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        reset();
        onEditChange?.(false);
    };

    const saveEdit = (id: number) => {
        setIsSaving(true);

        Inertia.patch(
            `/tasks/${id}`,
            {
                title: editTitle,
                user_id: data.user_id || null,
            },
            {
                onFinish: () => {
                    setIsSaving(false);
                    setEditingId(null);
                    setEditTitle('');
                    reset();
                    onEditChange?.(false);
                },
            },
        );
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
                <div className="mt-6 flex flex-col items-center justify-center">
                    <img src="9264828.jpg" className="max-w-36 opacity-90" />
                    <p className="mt-4 text-xl text-gray-500">
                        No activity found 🎉
                    </p>
                </div>
            ) : (
                <div className="m-4 overflow-x-auto">
                    <table className="w-full border-collapse rounded-xl bg-white shadow dark:bg-neutral-800">
                        <thead>
                            <tr className="border-b dark:border-neutral-700">
                                <th className="p-3 text-left">Done</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Assigned To</th>
                                <th className="p-3 text-left">Created At</th>
                                <th className="p-3 text-left">Completed On</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => {
                                const isThisEditing = editingId === task.id;

                                return (
                                    <tr
                                        key={task.id}
                                        className={`border-b last:border-none dark:border-neutral-700 ${
                                            isEditing && !isThisEditing
                                                ? 'opacity-60'
                                                : ''
                                        }`}
                                    >
                                        {/* CHECK */}
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                disabled={isCheck || isEditing}
                                                onChange={() => toggle(task.id)}
                                                className="h-5 w-5 rounded"
                                            />
                                        </td>

                                        {/* TITLE */}
                                        <td className="p-3">
                                            {isThisEditing ? (
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) =>
                                                        setEditTitle(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter')
                                                            saveEdit(task.id);
                                                        if (e.key === 'Escape')
                                                            cancelEdit();
                                                    }}
                                                    autoFocus
                                                    className="w-full rounded border px-2 py-1"
                                                />
                                            ) : (
                                                <span
                                                    className={`font-medium ${
                                                        task.completed
                                                            ? 'line-through text-gray-400'
                                                            : ''
                                                    }`}
                                                >
                                                    {task.title}
                                                </span>
                                            )}
                                        </td>

                                        {/* ASSIGNED TO */}
                                        <td className="p-3">
                                            {isThisEditing ? (
                                                <select
                                                    value={data.user_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            'user_id',
                                                            e.target.value
                                                                ? Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : '',
                                                        )
                                                    }
                                                    className="w-full rounded border p-2"
                                                >
                                                    <option value="">
                                                        Assign to...
                                                    </option>
                                                    {users.map((user) => (
                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>
                                                    {task.user
                                                        ? task.user.name
                                                        : '—'}
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {task.created_at_formatted}
                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {task.completed_at_formatted ??
                                                '—'}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-3 text-right whitespace-nowrap">
                                            {showEdit &&
                                                (isThisEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                saveEdit(
                                                                    task.id,
                                                                )
                                                            }
                                                            disabled={isSaving}
                                                            className="mr-2 text-green-500"
                                                        >
                                                            ✔
                                                        </button>

                                                        <button
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                            className="mr-3 text-gray-500"
                                                        >
                                                            ✖
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            startEdit(task)
                                                        }
                                                        disabled={isEditing}
                                                        className="mr-3 text-yellow-500"
                                                    >
                                                        ✎
                                                    </button>
                                                ))}

                                            <button
                                                onClick={() =>
                                                    remove(task.id)
                                                }
                                                disabled={isEditing}
                                                className="text-red-500"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DELETE */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-80 rounded-lg bg-white p-6 text-center">
                        <h2 className="mb-4 text-xl font-semibold">
                            Confirm delete
                        </h2>
                        <p className="mb-6">
                            Are you sure you want to delete this task?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                disabled={isDeleting}
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="rounded bg-red-500 px-4 py-2 text-white"
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
