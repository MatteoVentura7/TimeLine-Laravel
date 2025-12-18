import ListItem from '@/components/listItem';
import TaskForm from '@/components/taskForm';
import AppLayout from '@/layouts/app-layout';
import { dashboardActivity } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: dashboardActivity().url,
    },
];

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

interface TaskPagination {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function DashboardActivity({
    tasks,
    statistc,
}: {
    tasks: TaskPagination;
    statistc: { todo: number; done: number };
}) {
    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />

            <div className="relative aspect-video min-h-220 w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <div>
                    <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                        List of activity
                    </h1>

                    <div className="mr-5 flex items-center justify-end">
                        <span className="mr-3 font-bold text-blue-600">
                            To Do : {statistc.todo ?? 0}
                        </span>
                        <span className="font-bold text-green-600">
                            Done : {statistc.done ?? 0}
                        </span>
                        <button
                            onClick={() => setOpen(true)}
                            className="ml-5 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Add Activity
                        </button>
                    </div>

                    {/* MODAL */}
                    {open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-2 shadow-lg">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        X
                                    </button>
                                </div>

                                <TaskForm />

                                <div className="mt-4 flex justify-end"></div>
                            </div>
                        </div>
                    )}

                    {/* LISTA TASK */}
                    <ListItem tasks={tasks} />
                </div>
            </div>
        </AppLayout>
    );
}
