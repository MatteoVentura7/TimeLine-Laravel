import ListItem from '@/components/listItem';
import TaskForm from '@/components/taskForm';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ChartCounter from '../components/chartCounter';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 xl:grid-cols-3">
                    <div className="relative aspect-video min-h-105 w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* LISTA TASK */}
                        <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                            List of activity
                        </h1>
                        
                        <ListItem tasks={tasks} />
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* FORM AGGIUNTA TASK */}
                        <TaskForm />
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
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
