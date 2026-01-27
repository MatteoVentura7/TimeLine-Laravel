import type { Task, User } from '@/types/task-user';
import { router as Inertia } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import CompleteTaskModal from './CompleteTaskModal';
import ConfirmDeleteModal from './confirmDeleteModal';
import TaskInfoModal from './taskInfoModal';

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
    const [isInfoEditing, setIsInfoEditing] = useState(false);
    const [infoEditTitle, setInfoEditTitle] = useState('');
    const [infoEditUserId, setInfoEditUserId] = useState<number | ''>('');

    // COMPLETE MODAL
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [completedAt, setCompletedAt] = useState('');

    const isEditing = editingId !== null;

    /* ================= EDIT ================= */

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
            },
        );
    };

    /* ================= COMPLETE ================= */

    const isoToLocalDatetime = (iso: string) => {
        const d = new Date(iso);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60_000);
        return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    };

    const openCompleteModal = (task: Task) => {
        setTaskToComplete(task);
        setCompletedAt(isoToLocalDatetime(new Date().toISOString()));
        setCompleteModalOpen(true);
    };

    const confirmComplete = () => {
        if (!taskToComplete) return;

        setIsCheck(true);

        Inertia.patch(
            `/tasks/${taskToComplete.id}/complete`,
            {
                completed_at: completedAt,
            },
            {
                onFinish: () => {
                    setIsCheck(false);
                    setCompleteModalOpen(false);
                    setTaskToComplete(null);
                },
            },
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

    /* ================= INFO MODAL ================= */

    const openInfoModal = (task: Task) => {
        setSelectedTask(task);
        setInfoEditTitle(task.title);
        setInfoEditUserId(task.user?.id ?? '');
        setIsInfoEditing(false);
        setInfoModalOpen(true);
    };

    const saveInfoEdit = () => {
        if (!selectedTask) return;

        setIsCheck(true);

        Inertia.patch(
            `/tasks/${selectedTask.id}`,
            {
                title: infoEditTitle,
                user_id: infoEditUserId || null,
            },
            {
                onFinish: () => {
                    setIsCheck(false);
                    setIsInfoEditing(false);
                    setSelectedTask(null);
                    setInfoModalOpen(false);
                },
            },
        );
    };

    const cancelInfoEdit = () => {
        setInfoEditTitle(selectedTask?.title ?? '');
        setInfoEditUserId(selectedTask?.user?.id ?? '');
        setIsInfoEditing(false);
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
                                                                          .value,
                                                                  )
                                                                : '',
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
                                            {task.expiration_formatted ?? '—'}
                                        </td>
                                        <td className="p-3">
                                            {task.completed_at_formatted ?? '—'}
                                        </td>

                                        <td className="p-3 text-right whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    openInfoModal(task)
                                                }
                                                className="mr-3 cursor-pointer text-blue-500"
                                            >
                                                <i className="fa-solid fa-circle-info"></i>
                                            </button>

                                            <button
                                                onClick={() => remove(task.id)}
                                                disabled={isEditing}
                                                className="cursor-pointer text-red-500"
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

            {/* DELETE MODAL */}
            <ConfirmDeleteModal
                open={confirmOpen}
                loading={isDeleting}
                title="Confirm delete"
                message="Are you sure you want to delete this task?"
                onCancel={() => {
                    setConfirmOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDelete}
            />

            {/* COMPLETE MODAL */}
            <CompleteTaskModal
                open={completeModalOpen}
                task={taskToComplete}
                completedAt={completedAt}
                loading={isCheck}
                onChangeCompletedAt={setCompletedAt}
                onClose={() => {
                    setCompleteModalOpen(false);
                    setTaskToComplete(null);
                }}
                onConfirm={confirmComplete}
            />

            <TaskInfoModal
                task={selectedTask}
                users={users}
                open={infoModalOpen}
                onClose={() => {
                    setInfoModalOpen(false);
                    setSelectedTask(null);
                }}
            />
        </div>
    );
}
