import ConfirmDeleteModal from '@/components/confirmDeleteModal';
import AppLayout from '@/layouts/app-layout';
import { dashboardActivity, subtasksInfo } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft,
    CheckCircle2, 
    Circle,
    Edit,
    Save,
    X,
    Trash2,
    Calendar,
    Clock,
    CheckCircle,
    ListTodo,
    Link as LinkIcon
} from 'lucide-react';

export default function SubtaskInfo({ subtask }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Subtask Details',
            href: subtasksInfo(subtask.id).url,
        },
    ];

    const isCompleted = subtask.completed;

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(subtask.title);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleBack = () => {
        const params = new URLSearchParams(window.location.search);
        const fromTask = params.get('from_task');
        const url = fromTask
            ? `${dashboardActivity().url}?open_task=${fromTask}`
            : dashboardActivity().url;
        router.visit(url);
    };

    const handleUpdate = () => {
        router.patch(
            `/subtasks/${subtask.id}`,
            { title },
            {
                preserveState: false,
                onSuccess: () => setIsEditing(false),
            },
        );
    };

    const handleToggleComplete = () => {
        router.patch(
            `/subtasks/${subtask.id}/toggle`,
            {},
            {
                preserveState: false,
            },
        );
    };

    const handleDelete = () => {
        router.delete(`/subtasks/${subtask.id}`, {});
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subtask Details" />

            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tasks
                </Button>

                {/* Main Content - Vertical Stack */}
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Subtask Details Card */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`p-2 rounded-lg ${
                                        isCompleted 
                                            ? 'bg-green-100 dark:bg-green-900' 
                                            : 'bg-orange-100 dark:bg-orange-900'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg">Subtask Details</CardTitle>
                                        <Badge 
                                            variant={isCompleted ? "default" : "secondary"} 
                                            className={`mt-1 ${isCompleted ? 'bg-green-500' : ''}`}
                                        >
                                            {isCompleted ? 'Completed' : 'In Progress'}
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Status Toggle Button */}
                                <Button
                                    onClick={handleToggleComplete}
                                    variant="outline"
                                    size="sm"
                                    className={`gap-2 ${
                                        isCompleted 
                                            ? 'border-green-200 hover:bg-green-50 dark:border-green-800' 
                                            : 'border-orange-200 hover:bg-orange-50 dark:border-orange-800'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span >Mark Incomplete</span>
                                        </>
                                    ) : (
                                        <>
                                            <Circle className="h-4 w-4 text-orange-600" />
                                            <span >Mark Complete</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* Parent Task Reference */}
                            <div className="mb-6 flex items-center gap-2 rounded-lg bg-muted p-3">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Parent Task</p>
                                    <p className="text-sm font-medium">{subtask.task.title}</p>
                                </div>
                            </div>

                            <Separator className="mb-6" />

                            {/* Subtask Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Subtask Title
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-lg"
                                        placeholder="Enter subtask title"
                                    />
                                ) : (
                                    <p className="text-lg font-medium">{subtask.title}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={handleUpdate}
                                            className="gap-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setTitle(subtask.title);
                                            }}
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="secondary"
                                            className="gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => setConfirmOpen(true)}
                                            variant="destructive"
                                            className="gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-6 border-l-2 border-border pl-6">
                                {/* Created */}
                                <div className="relative">
                                    <div className="absolute -left-[1.6rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-blue-500">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div className='ml-3'>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 ">
                                            Created
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatDate(subtask.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="relative">
                                    <div className="absolute -left-[1.6rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-gray-400">
                                        <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <div className='ml-3'>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            Last Updated
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatDate(subtask.updated_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Completed (if applicable) */}
                                {isCompleted && subtask.completed_at && (
                                    <div className="relative">
                                        <div className="absolute -left-[1.6rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-green-500">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <div className='ml-3'>
                                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                Completed
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {formatDate(subtask.completed_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmDeleteModal
                open={confirmOpen}
                message="Are you sure you want to delete this subtask?"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}