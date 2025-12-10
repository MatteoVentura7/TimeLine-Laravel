import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { queryParams } from '@/wayfinder';
import { Inertia } from '@inertiajs/inertia';



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

export default function Dashboard({ tasks = [] }: { tasks: Task[] }) {

       const { data, setData, post, reset } = useForm({ title: "" });

       const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = `/tasks${queryParams({})}`;
        post(url, {
            onSuccess: () => reset(),
        });
    };

    const toggle = (id: number) => {
        const url = `/tasks/${id}/toggle${queryParams({})}`;
        post(url, {
            headers: {
                'X-HTTP-Method-Override': 'PATCH',
            },
            onSuccess: () => console.log(`Toggled task with id: ${id}`),
        });
    };

    const remove = (id: number) => {
        const url = `/tasks/${id}${queryParams({})}`;
        Inertia.delete(url, {
            onSuccess: () => console.log(`Removed task with id: ${id}`),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <h1 className='text-center mt-5 font-bold text-3xl text-blue-500 '>To Do</h1>
                            <ul className="list-none p-0 m-8">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggle(task.id)}
                            className="mr-2 cursor-pointer"
                        />
                        <span
                            className={`flex-grow ${
                                task.completed
                                    ? "line-through text-gray-500"
                                    : ""
                            }`}
                        >
                            {task.title}
                        </span>
                        <button
                            onClick={() => remove(task.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border ">
                       <form onSubmit={submit} className="flex flex-col gap-2 mb-4 m-8">
                <input
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Aggiungi task..."
                    className="flex-grow p-2 border border-gray-300 rounded w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  mt-2 cursor-pointer"
                >
                    Add
                </button>
            </form>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
