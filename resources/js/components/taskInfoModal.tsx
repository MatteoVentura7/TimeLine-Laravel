import type { Task, User } from '@/types/task-user';
import { router } from '@inertiajs/core';
import { useState } from 'react';
import Modal from './modal';
import SubTaskList from './subTaskList';
import IncompleteSubtasksWarningModal from './InCompleteSubtasksWarningModal';
import TaskFormFields from './TaskFormFields';
import { useTaskForm } from '@/hooks/useTaskForm';

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
    const [loading, setLoading] = useState(false);
    const [incompleteSubtasksWarning, setIncompleteSubtasksWarning] = useState(false);

    const form = useTaskForm({ task });

    const handleCompletedToggle = () => {
        if (form.completed) {
            // Uncompleting - no warning needed
            form.setCompleted(false);
            form.setCompletedAt('');
        } else {
            // Completing - check for incomplete subtasks
            const hasIncompleteSubtasks = task?.subtasks?.some(st => !st.completed);
            if (hasIncompleteSubtasks) {
                setIncompleteSubtasksWarning(true);
            } else {
                form.setCompleted(true);
                form.setCompletedAt('');
            }
        }
    };

    const handleSave = () => {
        if (!task || !form.validate()) return;

        setLoading(true);

        router.patch(
            `/tasks/${task.id}`,
            form.getFormData(),
            {
                onFinish: () => {
                    setLoading(false);
                    form.resetEdit();
                    handleClose();
                },
            },
        );
    };

    const handleClose = () => {
        router.reload({ only: ['tasks'] });
        onClose();
    };

    if (!task) return null;

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                title="Task Details"
                width="w-[1200px]"
            >
                <div className="space-y-6">
                    {/* Edit Actions */}
                    <div className="flex items-center justify-end gap-2">
                        {form.isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-green-500 px-3 py-1 text-white transition hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                                    ) : (
                                        <i className="fa-solid fa-check"></i>
                                    )}
                                    Save
                                </button>
                                <button
                                    onClick={form.cancelEdit}
                                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-200 px-3 py-1 text-gray-700 transition hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-neutral-700 dark:text-gray-200"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => form.setIsEditing(true)}
                                className="flex cursor-pointer items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1 text-yellow-700 transition hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:bg-yellow-900 dark:text-yellow-100"
                            >
                                <i className="fa-solid fa-pen"></i>
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Form Fields */}
                    <TaskFormFields
                        isEditing={form.isEditing}
                        task={task}
                        title={form.title}
                        userId={form.userId}
                        completed={form.completed}
                        completedAt={form.completedAt}
                        expiration={form.expiration}
                        createdAt={form.createdAt}
                        users={users}
                        errors={form.errors}
                        onTitleChange={form.setTitle}
                        onUserChange={form.setUserId}
                        onCompletedChange={handleCompletedToggle}
                        onCompletedAtChange={form.setCompletedAt}
                        onExpirationChange={form.setExpiration}
                        onCreatedAtChange={form.setCreatedAt}
                    />

                    {/* Subtasks */}
                    <SubTaskList task={task} disabled={form.isEditing} />
                </div>
            </Modal>

            {/* Incomplete Subtasks Warning Modal */}
            <IncompleteSubtasksWarningModal
                open={incompleteSubtasksWarning}
                subtasks={task?.subtasks || []}
                onClose={() => setIncompleteSubtasksWarning(false)}
                onConfirm={() => {
                    setIncompleteSubtasksWarning(false);
                    form.setCompleted(true);
                    form.setCompletedAt('');
                }}
            />
        </>
    );
}