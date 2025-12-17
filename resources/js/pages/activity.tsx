import { useState } from 'react';
import ListItem from '@/components/listItem';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TaskForm from '@/components/taskForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: dashboard().url,
    },
];

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export default function Activity({
    tasks = [],
    statistc,
}: {
    tasks: Task[];
    statistc: number[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />

            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <div>
                    <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                        List of activity
                    </h1>

                    <div className="mr-5 flex justify-end items-center">
                        <span className='mr-3 text-blue-600 font-bold'>To Do : {statistc[0] ?? 0}</span>
                        <span className='text-green-600 font-bold'>Done : {statistc[1] ?? 0}</span>
                        <button
                            onClick={() => setOpen(true)}
                            className=" rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ml-5 cursor-pointer"
                        >
                            Add Activity
                        </button>
                    </div>

                    {/* MODAL */}
                    {open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-2 shadow-lg">
                                <div className='flex justify-end'>
                                    
                                 <button
                                        onClick={() => setOpen(false)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        X
                                    </button>
                                    </div>

                                <TaskForm />

                                <div className="mt-4 flex justify-end">
                                  
                                </div>
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
