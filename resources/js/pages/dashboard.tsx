import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { queryParams } from '@/wayfinder';
import { Inertia } from '@inertiajs/inertia';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export default function Dashboard({
    tasks = [],
    statistc,
}: {
    tasks: Task[];
    statistc: number[];
}) {
    const { data, setData, post, reset, patch } = useForm({ title: '' });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isCheck, setIsCheck] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // PAGINAZIONE
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 4;
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        const url = `/tasks${queryParams({})}`;
        post(url, {
            onSuccess: () => reset(),
            onFinish: () => setIsAdding(false),
        });
    };

    const toggle = (id: number) => {
        setIsCheck(true);
        const url = `/tasks/${id}/toggle${queryParams({})}`;
        patch(url, {
            onSuccess: () => console.log(`Toggled task with id: ${id}`),
            onFinish: () => setIsCheck(false),
        });
    };

    const remove = (id: number) => {
        setTaskToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete) return;
        setIsDeleting(true);
        const url = `/tasks/${taskToDelete}${queryParams({})}`;
        Inertia.delete(url, {
            onSuccess: () => {
                console.log(`Removed task with id: ${taskToDelete}`);
                setConfirmOpen(false);
                setTaskToDelete(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* POP UP DI CONFERMA ELIMINAZIONE */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl dark:bg-neutral-900">
                        <h2 className="mb-4 text-xl font-semibold">
                            Confirm delete
                        </h2>
                        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                            Are you sure you want to delete this task?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                disabled={isDeleting}
                                className="cursor-pointer rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 xl:grid-cols-3">
                    {/* LISTA TASK */}
                    <div className=" min-h-105 w-full relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                            List of activity
                        </h1>

                        {tasks.length === 0 ? (
                            <div className="animate-fadeInUp mt-6 flex flex-col items-center justify-center">
                                <img
                                    src="9264828.jpg"
                                    className="3xl:max-w-50 3xl:max-w-36 max-w-24 opacity-90 sm:max-w-36 lg:max-w-44 xl:max-w-18 2xl:max-w-30"
                                />
                                <p className="mt-4 text-xl text-gray-500">
                                    No activity found 🎉
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="m-4 max-h-100 space-y-3 p-0 pr-2 pb-2">
                                    {currentTasks.map((task) => (
                                        <li
                                            key={task.id}
                                            className="flex items-center justify-between rounded-xl bg-white p-4 shadow transition-shadow duration-300 hover:shadow-lg dark:bg-neutral-800"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    disabled={isCheck}
                                                    checked={task.completed}
                                                    onChange={() => toggle(task.id)}
                                                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-400"
                                                />
                                                <span
                                                    className={`font-medium text-gray-800 transition-colors duration-200 dark:text-gray-200 ${
                                                        task.completed
                                                            ? 'text-gray-400 line-through dark:text-gray-500'
                                                            : ''
                                                    }`}
                                                >
                                                    {task.title}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => remove(task.id)}
                                                className="cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-600"
                                                title="Delete task"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* PAGINAZIONE */}
                                {tasks.length > tasksPerPage && (
                                    <div className="flex justify-center gap-2 mt-2">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded border disabled:opacity-50"
                                        >
                                         <h1 className='text-xl'> &lt;&lt; </h1>  


                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`px-3 py-1 rounded border ${
                                                    currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded border disabled:opacity-50"
                                        >
                                            <h1 className='text-xl'> &gt;&gt; </h1>  
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* FORM AGGIUNTA TASK */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                            Add activity form
                        </h1>
                        <form
                            onSubmit={submit}
                            className="m-8 mb-4 flex flex-col gap-2"
                        >
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Add activity..."
                                className="w-full grow rounded border border-gray-300 p-2"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="mt-2 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isAdding ? 'Adding...' : 'Add'}
                            </button>
                        </form>
                    </div>

                    {/* STATISTICHE */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h1 className="mt-5 mb-4 text-center text-3xl font-bold text-blue-500">
                            Your progress chart
                        </h1>
                        <div className="flex justify-center gap-4">
                            <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                                <span className="font-semibold">To Do</span>{' '}
                                <h1 className="mt-3 text-4xl font-bold text-blue-600">
                                    {statistc[0] || 0}
                                </h1>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                                <span className="font-semibold">Done</span>{' '}
                                <h1 className="mt-3 text-4xl font-bold text-green-600">
                                    {statistc[1] || 0}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
