import AppLayout from '@/layouts/app-layout';
import { subtasksInfo } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function SubtaskInfo({ subtask }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Subtask Details',
            href: subtasksInfo(subtask.id).url,
        },
    ];

    const isCompleted = subtask.completed;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subtask Details" />

            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-4xl space-y-6"> 
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                    >
                        ← Back
                    </button>

                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-md font-bold text-gray-500">
                                    Task{' '}
                                    <span className="ml-1 text-md font-light text-gray-400">
                                        {subtask.task.title}
                                    </span>
                                </p>
<h1 className="mt-4 text-xl font-bold text-gray-900">Subtask</h1>
                                <h1 className="mt-2 text-xl font-light text-gray-700">
                                    {subtask.title}
                                </h1>
                            </div>

                            <span
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                                    isCompleted
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-yellow-50 text-yellow-600'
                                }`}
                            >
                                {isCompleted ? 'Completed' : 'Pending'}
                            </span>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <a className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                                Edit
                            </a>

                            <button className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
                                Delete
                            </button>
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
        </AppLayout>
    );
}
