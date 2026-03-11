import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskForm } from '@/hooks/useTaskForm';
import type { Task, TaskFile, User } from '@/types/task-user';
import { router } from '@inertiajs/core';
import {
    Check,
    CheckCircle2,
    Clock,
    Download,
    Edit,
    FileIcon,
    ListTodo,
    Loader2,
    Paperclip,
    Save,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    const [showCompletionDatePrompt, setShowCompletionDatePrompt] =
        useState(false);
    const [preserveEditMode, setPreserveEditMode] = useState(false);

    // File upload state
    const [fileUploading, setFileUploading] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (mimeType: string | null) => {
        if (!mimeType) return <FileIcon className="h-4 w-4" />;
        if (mimeType.startsWith('image/')) return <FileIcon className="h-4 w-4 text-blue-500" />;
        if (mimeType === 'application/pdf') return <FileIcon className="h-4 w-4 text-red-500" />;
        return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!task || !e.target.files?.length) return;
        const files = Array.from(e.target.files);
        setFileUploading(true);

        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));

        router.post(`/tasks/${task.id}/files`, formData as any, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['tasks'], onFinish: () => setFileUploading(false) });
            },
            onError: () => setFileUploading(false),
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileDelete = (fileId: number) => {
        setDeletingFileId(fileId);
        router.delete(`/task-files/${fileId}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['tasks'], onFinish: () => setDeletingFileId(null) });
            },
            onError: () => setDeletingFileId(null),
        });
    };

    const form = useTaskForm({ task });

    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    // useEffect(() => {
    //     if (showCompletionDatePrompt) {
    //         const timer = setTimeout(() => {
    //             setShowCompletionDatePrompt(false);
    //         }, 5000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [showCompletionDatePrompt]);

    useEffect(() => {
        if (preserveEditMode && task) {
            form.setIsEditing(true);
            form.setCompleted(true);
            form.setCompletedAt('');
            setPreserveEditMode(false);
        }
    }, [task, preserveEditMode]);

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
                <div className="-mx-6 -mt-6 mb-6 border-b bg-linear-to-r px-6 py-6 ">
                    <div className="flex items-center justify-between gap-4">
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
                        <div className="flex items-center gap-2 rounded-2xl">
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
                        <SubTaskList task={task} disabled={form.isEditing} />
                    </div>

                    {/* Separator */}
                    <div className="border-t"></div>

                    {/* Attachments */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                                {task.files?.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        {task.files.length}
                                    </Badge>
                                )}
                            </h3>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled={fileUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {fileUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">Upload</span>
                                </Button>
                            </div>
                        </div>

                        {!task.files || task.files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-input py-8 text-center text-muted-foreground">
                                <Paperclip className="mb-2 h-8 w-8 opacity-40" />
                                <p className="text-sm">No attachments yet</p>
                                <p className="text-xs opacity-70">Upload files to attach them to this task</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {task.files.map((file: TaskFile) => (
                                    <li
                                        key={file.id}
                                        className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                                    >
                                        {getFileIcon(file.mime_type)}
                                        <span className="min-w-0 flex-1 truncate font-medium">
                                            {file.original_name}
                                        </span>
                                        {file.size && (
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {formatFileSize(file.size)}
                                            </span>
                                        )}
                                        <a
                                            href={file.url}
                                            download
                                            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                            title="Download"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => handleFileDelete(file.id)}
                                            disabled={deletingFileId === file.id}
                                            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {deletingFileId === file.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
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

                    setPreserveEditMode(true);

                    form.setCompleted(true);

                    setShowCompletionDatePrompt(true);

                 
                }}
            />
        </>
    );
}
