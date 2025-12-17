import ListItem from '@/components/listItem';
import TaskForm from '@/components/taskForm';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ChartCounter from '../components/chartCounter';

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

export default function Greetings({
    tasks = [],
    statistc,
}: {
    tasks: Task[];
    statistc: number[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />
            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <div className="flex justify-around p-10">
                    <div className="w-full max-w-150 ">
                    {/* FORM AGGIUNTA TASK */}
                    <TaskForm />
                   
                </div>
                 <div>
                    {/* STATISTICHE */}
                    <ChartCounter statistc={statistc} />
                    </div>
                    </div>
                <div>
                    {/* LISTA TASK */}
                    <ListItem tasks={tasks} />
                </div>
            </div>
        </AppLayout>
    );
}
