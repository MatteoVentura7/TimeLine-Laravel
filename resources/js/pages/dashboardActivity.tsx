import TableUser from '@/components/tableUser';
import TaskForm from '@/components/taskForm';
import AppLayout from '@/layouts/app-layout';
import { dashboardActivity } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { router as Inertia } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: dashboardActivity().url,
    },
];

interface User {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    completed: boolean;
    created_at_formatted: string;
    completed_at_formatted: string;
    created_at_iso: string;
    expiration_formatted: string;
    user?: User;
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
    users,
}: {
    tasks: TaskPagination;
    statistc: { todo: number; done: number };
    users: User[];
}) {
    const [search, setSearch] = useState('');
    const [searchMessage, setSearchMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        const storedSearch = localStorage.getItem('searchTerm');
        if (storedSearch) {
            setSearch(storedSearch);
            setSearchMessage(
                `Search results with the word : "${storedSearch}"`,
            );
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (search) {
            localStorage.setItem('searchTerm', search);
            setSearchMessage(`Risultati per: "${search}"`);
        } else {
            localStorage.removeItem('searchTerm');
            setSearchMessage(null);
        }

        Inertia.get(
            dashboardActivity().url,
            { search },
            { preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />

            <div className="relative min-h-220 w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <div>
                    <div className="mt-5 mr-5 ml-5 flex flex-col items-center justify-between lg:flex-row">
                        {/* SEARCH */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mr-5 mb-3 flex items-center justify-end lg:mb-0"
                        >
                            <input
                                type="text"
                                placeholder="Search activity"
                                value={search}
                                onChange={handleSearchChange}
                                disabled={isEditing}
                                className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isEditing}
                                className="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </form>

                        {/* STATS + ADD */}
                        <div>
                            <span className="mr-3 font-bold text-blue-600">
                                To Do : {statistc.todo ?? 0}
                            </span>
                            <span className="font-bold text-green-600">
                                Done : {statistc.done ?? 0}
                            </span>

                            <button
                                onClick={() => setCreateOpen(true)}
                                disabled={isEditing}
                                className="ml-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                Add Activity
                            </button>
                        </div>
                    </div>

                    {searchMessage && (
                        <div className="mt-3 p-2 text-center text-sm font-bold">
                            {searchMessage}
                        </div>
                    )}

                    {/* CREATE TASK MODAL */}
                    <TaskForm
                        users={users}
                        open={createOpen}
                        onClose={() => setCreateOpen(false)}
                    />

                    {/* TASK LIST */}
                    <TableUser
                        tasks={tasks.data}
                        showEdit={true}
                        onEditChange={setIsEditing}
                        users={users}
                    />

                    {/* PAGINATION */}
                    {tasks.last_page > 1 && (
                        <div className="mt-auto flex justify-center gap-2">
                            {tasks.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url || isEditing}
                                    onClick={() =>
                                        link.url && Inertia.get(link.url)
                                    }
                                    className={`rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
                                            : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
