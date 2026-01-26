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

    const { data, setData, reset } = useForm<{ user_id: number | '' }>({
        user_id: '',
    });

    const [isCheck, setIsCheck] = useState(false);

    // DELETE MODAL
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // INLINE EDIT
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // INFO MODAL
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // COMPLETE MODAL
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [completedDate, setCompletedDate] = useState('');

    const isEditing = editingId !== null;

    /* ================= EDIT ================= */

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
            { title: editTitle, user_id: data.user_id || null },
            {
                onFinish: () => {
                    setIsSaving(false);
                    setEditingId(null);
                    setEditTitle('');
                    reset();
                    onEditChange?.(false);
                },
            }
        );
    };

    /* ================= COMPLETE ================= */

    const openCompleteModal = (task: Task) => {
        setTaskToComplete(task);
        setCompletedDate(new Date().toISOString().slice(0, 10));
        setCompleteModalOpen(true);
    };

    const confirmComplete = () => {
        if (!taskToComplete) return;

        setIsCheck(true);

        Inertia.patch(
            `/tasks/${taskToComplete.id}/complete`,
            { completed_at: completedDate },
            {
                onFinish: () => {
                    setIsCheck(false);
                    setCompleteModalOpen(false);
                    setTaskToComplete(null);
                },
            }
        );
    };

    /* ================= DELETE ================= */

    const remove = (id: number) => {
        setTaskToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete || isDeleting) return;

        setIsDeleting(true);
        Inertia.delete(`/tasks/${taskToDelete}`, {
            onFinish: () => {
                setConfirmOpen(false);
                setTaskToDelete(null);
                setIsDeleting(false);
            },
        });
    };

    /* ================= INFO ================= */

    const openInfoModal = (task: Task) => {
        setSelectedTask(task);
        setInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setInfoModalOpen(false);
        setSelectedTask(null);
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
                                <th className="p-3 text-left">
                                    Completed On
                                </th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => {
                                const isThisEditing =
                                    editingId === task.id;
                                const createdAt = new Date(
                                    task.created_at_iso
                                );
                                const isFutureTask =
                                    createdAt.getTime() > Date.now();

                                return (
                                    <tr
                                        key={task.id}
                                        className={`border-b last:border-none dark:border-neutral-700 ${
                                            isEditing && !isThisEditing
                                                ? 'opacity-60'
                                                : ''
                                        }`}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                disabled={
                                                    isCheck ||
                                                    isEditing ||
                                                    isFutureTask ||
                                                    task.completed
                                                }
                                                onChange={() =>
                                                    openCompleteModal(task)
                                                }
                                                className="h-5 w-5 cursor-pointer rounded"
                                            />
                                        </td>

                                        <td className="p-3">
                                            {isThisEditing ? (
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) =>
                                                        setEditTitle(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter')
                                                            saveEdit(task.id);
                                                        if (
                                                            e.key === 'Escape'
                                                        )
                                                            cancelEdit();
                                                    }}
                                                    className="w-full rounded border px-2 py-1"
                                                />
                                            ) : (
                                                <span className="font-medium">
                                                    {task.title}
                                                </span>
                                            )}
                                        </td>

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
                                                                          .value
                                                                  )
                                                                : ''
                                                        )
                                                    }
                                                    className="w-full rounded border p-2"
                                                >
                                                    <option value="">—</option>
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

                                        <td className="p-3">
                                            {task.created_at_formatted}
                                        </td>
                                        <td className="p-3">
                                            {task.expiration_formatted ??
                                                '—'}
                                        </td>
                                        <td className="p-3">
                                            {task.completed_at_formatted ??
                                                '—'}
                                        </td>

                                        <td className="p-3 text-right whitespace-nowrap">
                                            {showEdit &&
                                                (isThisEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                saveEdit(
                                                                    task.id
                                                                )
                                                            }
                                                            disabled={isSaving}
                                                            className="mr-2 text-green-500"
                                                        >
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                        <button
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                            className="mr-3 text-gray-500"
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
                                                        className="mr-3 text-yellow-500"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                ))}

                                            <button
                                                onClick={() =>
                                                    openInfoModal(task)
                                                }
                                                className="mr-3"
                                            >
                                                <i className="fa-solid fa-circle-info"></i>
                                            </button>

                                            <button
                                                onClick={() =>
                                                    remove(task.id)
                                                }
                                                disabled={isEditing}
                                                className="text-red-500"
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

            {/* DELETE MODAL (ORIGINALE) */}
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
                                {isDeleting
                                    ? 'Deleting...'
                                    : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPLETE MODAL */}
            {completeModalOpen && taskToComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-80 rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-semibold">
                            Complete task
                        </h2>

                        <input
                            type="date"
                            value={completedDate}
                            min={taskToComplete.created_at_iso.slice(
                                0,
                                10
                            )}
                            max={new Date()
                                .toISOString()
                                .slice(0, 10)}
                            onChange={(e) =>
                                setCompletedDate(e.target.value)
                            }
                            className="mb-6 w-full rounded border p-2"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setCompleteModalOpen(false)
                                }
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmComplete}
                                className="rounded bg-green-500 px-4 py-2 text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* INFO MODAL (ORIGINALE) */}
            {infoModalOpen && selectedTask && (
                <Modal
                    open={infoModalOpen}
                    onClose={closeInfoModal}
                    title="Task details"
                >
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-100 p-4 dark:bg-neutral-700">
                            <h3 className="text-lg font-semibold">
                                <i className="fa-solid fa-list-check mr-2 text-blue-500"></i>
                                {selectedTask.title}
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                                    selectedTask.completed
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                <i
                                    className={`fa-solid ${
                                        selectedTask.completed
                                            ? 'fa-circle-check'
                                            : 'fa-clock'
                                    }`}
                                ></i>
                                {selectedTask.completed
                                    ? 'Completed'
                                    : 'Pending'}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                <i className="fa-solid fa-user"></i>
                                {selectedTask.user
                                    ? selectedTask.user.name
                                    : 'Unassigned'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border p-3">
                                <p className="text-sm text-gray-500">
                                    Created at
                                </p>
                                <p className="font-medium">
                                    <i className="fa-regular fa-calendar mr-2"></i>
                                    {
                                        selectedTask.created_at_formatted
                                    }
                                </p>
                            </div>

                            <div className="rounded-lg border p-3">
                                <p className="text-sm text-gray-500">
                                    Expiration
                                </p>
                                <p className="font-medium">
                                    <i className="fa-regular fa-hourglass-half mr-2"></i>
                                    {selectedTask.expiration_formatted ??
                                        '—'}
                                </p>
                            </div>

                            <div className="rounded-lg border p-3 sm:col-span-2">
                                <p className="text-sm text-gray-500">
                                    Completed on
                                </p>
                                <p className="font-medium">
                                    <i className="fa-solid fa-check mr-2"></i>
                                    {selectedTask.completed_at_formatted ??
                                        '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
