import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskForm } from '@/hooks/useTaskForm';
import type { Task, User } from '@/types/task-user';
import { router } from '@inertiajs/core';
import {
    Check,
    CheckCircle2,
    Clock,
    Edit,
    ListTodo,
    Loader2,
    Save,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import IncompleteSubtasksWarningModal from './InCompleteSubtasksWarningModal';
import Modal from './modal';
import SubTaskList from './subTaskList';
import TaskFormFields from './TaskFormFields';

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
    const [incompleteSubtasksWarning, setIncompleteSubtasksWarning] =
        useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const form = useTaskForm({ task });

    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    const handleCompletedToggle = () => {
        if (form.completed) {
            form.setCompleted(false);
            form.setCompletedAt('');
        } else {
            const hasIncompleteSubtasks = task?.subtasks?.some(
                (st) => !st.completed,
            );
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
        setSaveSuccess(false);

        router.patch(`/tasks/${task.id}`, form.getFormData(), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ['tasks'],

                    onFinish: () => {
                        setLoading(false);
                        form.resetEdit();
                        setSaveSuccess(true);
                    },
                });
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleClose = () => {
        router.reload({ only: ['tasks'] });
        onClose();
    };

    if (!task) return null;

    const subtaskStats = task.subtasks
        ? {
              total: task.subtasks.length,
              completed: task.subtasks.filter((st) => st.completed).length,
          }
        : { total: 0, completed: 0 };

    return (
        <>
            <Modal open={open} onClose={handleClose} width="w-[1200px]">
                {/* Header */}
                <div className="-mx-6 -mt-6 mb-6 rounded-xl border-b bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:from-blue-950 dark:to-indigo-950 r">
                    <div className="flex items-center justify-between gap-4 ">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div
                                className={`rounded-lg p-2 ${
                                    task.completed
                                        ? 'bg-green-100 dark:bg-green-900'
                                        : 'bg-blue-100 dark:bg-blue-900'
                                }`}
                            >
                                {task.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-xl font-semibold">
                                    Task Details
                                </h2>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant={
                                            task.completed
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="text-xs"
                                    >
                                        {task.completed
                                            ? 'Completed'
                                            : 'In Progress'}
                                    </Badge>
                                    {subtaskStats.total > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 text-xs"
                                        >
                                            <ListTodo className="h-3 w-3" />
                                            {subtaskStats.completed}/
                                            {subtaskStats.total} subtasks
                                        </Badge>
                                    )}
                                    {/* Success Message */}
                                    {saveSuccess && (
                                        <Badge className="animate-in gap-1 bg-green-500 text-xs fade-in slide-in-from-top-2">
                                            <Check className="h-3 w-3" />
                                            Saved successfully!
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {form.isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={loading}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        <span className="hidden sm:inline">
                                            Save
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={form.cancelEdit}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Cancel
                                        </span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => form.setIsEditing(true)}
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Edit
                                        </span>
                                    </Button>
                                    <button
                                        onClick={onClose}
                                        className="cursor-pointer rounded-full p-2 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-700"
                                        aria-label="Close"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Form Fields */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Task Information
                        </h3>
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
                    </div>

                    {/* Separator */}
                    <div className="border-t"></div>

                    {/* Subtasks */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Subtasks
                        </h3>
                        <SubTaskList task={task} />
                    </div>
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
