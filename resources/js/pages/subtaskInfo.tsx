import ConfirmDeleteModal from '@/components/confirmDeleteModal';
import AppLayout from '@/layouts/app-layout';
import { subtasksInfo, dashboardActivity } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subtask Details" />

            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-4xl space-y-6">
                    <button
                        onClick={handleBack}
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                    >
                        ← Back
                    </button>

                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-md font-bold text-gray-500">
                                    Task{' '}
                                    <span className="text-md ml-1 font-light text-gray-400">
                                        {subtask.task.title}
                                    </span>
                                </p>

                                <h1 className="mt-4 text-xl font-bold text-gray-900">
                                    Subtask
                                </h1>

                                {isEditing ? (
                                    <input
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xl font-light focus:border-blue-500 focus:outline-none"
                                    />
                                ) : (
                                    <h1 className="mt-2 text-xl font-light text-gray-700">
                                        {subtask.title}
                                    </h1>
                                )}
                            </div>

                            <button
                                onClick={handleToggleComplete}
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer ${
                                    isCompleted
                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                }`}
                            >
                                {isCompleted ? '✓ Completed' : '○ Pending'}
                            </button>
                        </div>

                        <div className="mt-8 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTitle(subtask.title);
                                        }}
                                        className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setConfirmOpen(true)}
                                        className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Activity Timeline
                        </h2>

                        <div className="relative space-y-8 border-l border-gray-200 pl-6">
                            <div className="relative">
                                <span className="absolute top-1 -left-3 h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                                <p className="text-sm text-gray-500">Created</p>
                                <p className="font-medium text-gray-700">
                                    {new Date(
                                        subtask.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div className="relative">
                                <span className="absolute top-1 -left-3 h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                                <p className="text-sm text-gray-500">
                                    Last Updated
                                </p>
                                <p className="font-medium text-gray-700">
                                    {new Date(
                                        subtask.updated_at,
                                    ).toLocaleString()}
                                </p>
                            </div>

                            {isCompleted && (
                                <div className="relative">
                                    <span className="absolute top-1 -left-3 h-2.5 w-2.5 rounded-full bg-green-600"></span>
                                    <p className="text-sm text-gray-500">
                                        Completed
                                    </p>
                                    <p className="font-medium text-gray-700">
                                        {new Date(
                                            subtask.completed_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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