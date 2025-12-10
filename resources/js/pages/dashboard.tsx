import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { queryParams } from '@/wayfinder';
import { Inertia } from '@inertiajs/inertia';
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

export default function Dashboard({ tasks = [], statistc }: { tasks: Task[]; statistc: number[] }) {

    const { data, setData, post, reset, patch } = useForm({ title: "" });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = `/tasks${queryParams({})}`;
        post(url, {
            onSuccess: () => reset(),
        });
    };

    const toggle = (id: number) => {
        const url = `/tasks/${id}/toggle${queryParams({})}`;
        patch(url, {
            onSuccess: () => console.log(`Toggled task with id: ${id}`),
        });
    };

    const remove = (id: number) => {
        setTaskToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete) return;

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

            {/*  MODALE DI CONFERMA ELIMINAZIONE */}
            {confirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl w-80 text-center">
                        <h2 className="text-xl font-semibold mb-4">Confirm delete</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                            Are you sure you want to delete this task?
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    
                    {/* LISTA TASK */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
    <h1 className="text-center mt-5 font-bold text-3xl text-blue-500">List of activity</h1>

    {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-6 animate-fadeInUp">
            <img
                src="9264828.jpg"
                className="w-56 opacity-90"
            />
            <p className="text-gray-500 text-xl mt-4">No activity found 🎉</p>
        </div>
    ) : (
        <ul className="p-0 m-8 space-y-3">
  {tasks.map((task) => (
    <li
      key={task.id}
      className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-4"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggle(task.id)}
          className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 cursor-pointer"
        />
        <span
          className={`text-gray-800 dark:text-gray-200 font-medium transition-colors duration-200 ${
            task.completed ? "line-through text-gray-400 dark:text-gray-500" : ""
          }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => remove(task.id)}
        className="text-red-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
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

    )}
</div>


                    {/* FORM AGGIUNTA TASK */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border ">
                        <h1 className='text-center mt-5 font-bold text-3xl text-blue-500 '>Add activity form</h1>
                        <form onSubmit={submit} className="flex flex-col gap-2 mb-4 m-8">
                            <input
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                placeholder="Add activity..."
                                className="flex-grow p-2 border border-gray-300 rounded w-full"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 cursor-pointer"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    {/* STATISTICHE */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border ">
                        <h1 className="text-3xl font-bold mb-4 text-blue-500 text-center mt-5">Your progress chart</h1>

                        <div className="flex gap-4 justify-center">
                            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-lg text-center">
                                <span className="font-semibold">To Do</span>{" "}
                                <h1 className="text-blue-600 font-bold text-4xl mt-3">
                                    {statistc[0] || 0}
                                </h1>
                            </div>

                            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-lg text-center">
                                <span className="font-semibold">Done</span>{" "}
                                <h1 className="text-green-600 font-bold text-4xl mt-3">
                                    {statistc[1] || 0}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
