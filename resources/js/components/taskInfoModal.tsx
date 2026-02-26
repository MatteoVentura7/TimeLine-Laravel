import type { Task, User } from '@/types/task-user';
import { router } from '@inertiajs/core';
import { useState } from 'react';
import Modal from './modal';
import SubTaskList from './subTaskList';
import IncompleteSubtasksWarningModal from './InCompleteSubtasksWarningModal';
import TaskFormFields from './TaskFormFields';
import { useTaskForm } from '@/hooks/useTaskForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    Clock, 
    Edit, 
    ListTodo, 
    Loader2, 
    Save, 
    X 
} from 'lucide-react';

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
            form.setCompleted(false);
            form.setCompletedAt('');
        } else {
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

    const subtaskStats = task.subtasks ? {
        total: task.subtasks.length,
        completed: task.subtasks.filter(st => st.completed).length,
    } : { total: 0, completed: 0 };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                
                width="w-[1200px]"
            >
                {/* Header */}
                <div className=" rounded-2xl px-6 py-4 -mt-6 -mx-6 mb-6 border-b bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg ${
                                task.completed 
                                    ? 'bg-green-100 dark:bg-green-900' 
                                    : 'bg-blue-100 dark:bg-blue-900'
                            }`}>
                                {task.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-semibold truncate">
                                    Task Details
                                </h2>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant={task.completed ? "default" : "secondary"} className="text-xs">
                                        {task.completed ? 'Completed' : 'In Progress'}
                                    </Badge>
                                    {subtaskStats.total > 0 && (
                                        <Badge variant="outline" className="text-xs gap-1">
                                            <ListTodo className="h-3 w-3" />
                                            {subtaskStats.completed}/{subtaskStats.total} subtasks
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
                                        <span className="hidden sm:inline">Save</span>
                                    </Button>
                                    <Button
                                        onClick={form.cancelEdit}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">Cancel</span>
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => form.setIsEditing(true)}
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Form Fields */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
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
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                            Subtasks
                        </h3>
                        <SubTaskList task={task} disabled={form.isEditing} />
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