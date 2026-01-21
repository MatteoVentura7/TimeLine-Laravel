import { router as Inertia } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
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
    created_at_iso: string;
    completed_at_formatted: string;
    expiration_formatted: string;
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

    const [infoModalOpen, setInfoModalOpen] = useState(false);

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

    const openInfoModal = () => {
        setInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setInfoModalOpen(false);
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
                                <th className="p-3 text-left">Expire</th>
                                <th className="p-3 text-left">Completed On</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => {
                                const isThisEditing = editingId === task.id;
                                const createdAt = new Date(task.created_at_iso);
                                const now = new Date();
                                const isFutureTask =
                                    createdAt.getTime() > now.getTime();
                                console.log(now);

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
                                                disabled={
                                                    isCheck ||
                                                    isEditing ||
                                                    isFutureTask
                                                }
                                                onChange={() => toggle(task.id)}
                                                className="h-5 w-5 cursor-pointer rounded"
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
                                                    className="w-full rounded border px-2 py-1"
                                                />
                                            ) : (
                                                <span
                                                    className={`font-medium ${
                                                        task.completed
                                                            ? 'text-gray-400 line-through'
                                                            : ''
                                                    }`}
                                                >
                                                    <span
                                                        className={`block max-w-[5ch] overflow-hidden font-medium text-ellipsis whitespace-nowrap min-[950px]:max-w-[5ch] sm:max-w-[8ch] md:max-w-[4ch] lg:max-w-[13ch] xl:max-w-[35ch] 2xl:max-w-[40ch] ${task.completed ? 'text-gray-400 line-through' : ''} `}
                                                    >
                                                        {task.title}
                                                    </span>
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
                                        <td className="p-3 font-medium">
                                            <div className="max-w-[6ch] overflow-hidden text-ellipsis whitespace-nowrap min-[901px]:max-w-[10ch] lg:max-w-[35ch] xl:max-w-[35ch] 2xl:max-w-[40ch]">
                                                {task.created_at_formatted}
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium">
                                            <div className="max-w-[6ch] overflow-hidden text-ellipsis whitespace-nowrap min-[901px]:max-w-[10ch] lg:max-w-[35ch] xl:max-w-[35ch] 2xl:max-w-[40ch]">
                                                {task.expiration_formatted ??
                                                    '—'}
                                            </div>
                                        </td>

                                        <td className="p-3 font-medium">
                                            <div className="max-w-[6ch] overflow-hidden text-ellipsis whitespace-nowrap min-[901px]:max-w-[10ch] lg:max-w-[35ch] xl:max-w-[35ch] 2xl:max-w-[40ch]">
                                                {task.completed_at_formatted ??
                                                    '—'}
                                            </div>
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
                                                            className="mr-2 cursor-pointer text-green-500 hover:text-green-600 disabled:opacity-50"
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
                                                        onClick={() =>
                                                            startEdit(task)
                                                        }
                                                        disabled={isEditing}
                                                        className="mr-3 cursor-pointer text-yellow-500 hover:text-yellow-600 disabled:opacity-50"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                ))}
                                            <button
                                                onClick={openInfoModal}
                                                className="mr-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <i className="fa-solid fa-circle-info"></i>
                                            </button>
                                            <button
                                                onClick={() => remove(task.id)}
                                                disabled={isEditing}
                                                className="cursor-pointer text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <i className="fa-solid fa-trash"></i>
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

            {/* MODAL INFO */}
            {infoModalOpen && (
                <Modal
                    open={infoModalOpen}
                    onClose={closeInfoModal}
                    title="Information"
                >
                    <p>This is the information modal content.</p>
                </Modal>
            )}
        </div>
    );
}
