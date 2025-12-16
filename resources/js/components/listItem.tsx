import { Inertia } from '@inertiajs/inertia';
import { queryParams } from '@/wayfinder';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export default function ListItem({ tasks = [] }: { tasks: Task[] }) {
    const { patch } = useForm({ title: '' });
    const [isCheck, setIsCheck] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 4;
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

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
        <div className="flex flex-col h-full">
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
                    <ul className="m-4 max-h-100 space-y-3 p-0 pr-2 pb-2 grow">
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
                                <div>
                                    <button
                                        onClick={() => remove(task.id)}
                                        className="cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-600"
                                        title="Delete task"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* PAGINAZIONE */}
                    {tasks.length > tasksPerPage && (
                        <div className="mt-auto flex justify-center gap-2 mb-5">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="rounded border px-3 py-1 disabled:opacity-50"
                            >
                                <h1 className="text-xl"> &lt;&lt; </h1>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`rounded border px-3 py-1 ${
                                        currentPage === i + 1
                                            ? 'bg-blue-500 text-white'
                                            : ''
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="rounded border px-3 py-1 disabled:opacity-50"
                            >
                                <h1 className="text-xl"> &gt;&gt; </h1>
                            </button>
                        </div>
                    )}
                </>
            )}
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
        </div>
    );
}
