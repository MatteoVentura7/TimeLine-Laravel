import AppLayout from '@/layouts/app-layout';
import { subtasksInfo } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

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

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-gray-500 hover:text-gray-900 transition"
                    >
                        ← Back
                    </button>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

                        {/* Header */}
                        <div className="flex justify-between items-start">

                            <div>
                                <p className="text-md  tracking-wide text-gray-400">
                                    Task   <span className='text-gray-500 font-bold text-lg ml-2'>{subtask.task.title}</span>
                                </p>
                               

                                <h1 className="mt-4 text-gray-800 text-xl font-bold">
                                    {subtask.title}
                                </h1>
                            </div>

                            {/* Status Badge */}
                            <span
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                                    isCompleted
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-yellow-50 text-yellow-600'
                                }`}
                            >
                                {isCompleted ? 'Completed' : 'Pending'}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-3">

                            <a
                                
                                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Edit
                            </a>

                            <button
                               
                                className="px-5 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Activity Timeline
                        </h2>

                        <div className="relative border-l border-gray-200 space-y-8 pl-6">

                            {/* Created */}
                            <div className="relative">
                                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                                <p className="text-sm text-gray-500">
                                    Created
                                </p>
                                <p className="text-gray-700 font-medium">
                                    {new Date(subtask.created_at).toLocaleString()}
                                </p>
                            </div>

                            {/* Updated */}
                            <div className="relative">
                                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                                <p className="text-sm text-gray-500">
                                    Last Updated
                                </p>
                                <p className="text-gray-700 font-medium">
                                    {new Date(subtask.updated_at).toLocaleString()}
                                </p>
                            </div>

                            {/* Completed */}
                            {isCompleted && (
                                <div className="relative">
                                    <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-green-600 rounded-full"></span>
                                    <p className="text-sm text-gray-500">
                                        Completed
                                    </p>
                                    <p className="text-gray-700 font-medium">
                                        {new Date(subtask.completed_at).toLocaleString()}
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
