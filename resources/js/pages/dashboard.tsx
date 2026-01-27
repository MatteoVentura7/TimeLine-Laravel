import ListItem from '@/components/listItem';
import TaskForm from '@/components/taskForm';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ChartCounter from '../components/chartCounter';
import type { TaskPagination,User } from '@/types/task-user'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


export default function Dashboard({
    users,
    tasks,
    statistc,
}: {
    tasks: TaskPagination;
    statistc: { todo: number; done: number };
    users: User[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
                    <div className="relative aspect-video min-h-95 w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* LISTA TASK */}

                        <ListItem tasks={tasks.data} />
                    </div>

                    <div className="relative flex aspect-video min-h-95 w-full items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* FORM AGGIUNTA TASK */}
                        <div className='w-96'>
                            <TaskForm users={users} />
                        </div>
                    </div>

                    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* STATISTICHE */}
                        <ChartCounter statistc={statistc} />
                    </div>
                </div>

                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
