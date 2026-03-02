import ListItem from '@/components/listItem';
import TaskForm from '@/components/taskForm';
import TaskInfoModal from '@/components/taskInfoModal';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import type { Task, TaskPagination, User } from '@/types/task-user';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ChartCounter from '../components/chartCounter';

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
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (selectedTask) {
            const updated = tasks.data.find((t) => t.id === selectedTask.id);
            if (updated) setSelectedTask(updated);
        }
    }, [tasks.data]);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
                    <div className="relative aspect-video min-h-95 w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* LISTA TASK */}

                        <ListItem
                            tasks={tasks.data}
                            onTaskClick={handleTaskClick}
                        />
                    </div>

                    <div className="relative flex aspect-video min-h-95 w-full items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* FORM AGGIUNTA TASK */}
                        <div className="w-96">
                            <TaskForm users={users} />
                        </div>
                    </div>

                    <div className="relative flex aspect-video min-h-95 w-full items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* STATISTICHE */}
                        <ChartCounter statistc={statistc} />
                    </div>
                </div>

                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl md:min-h-min"></div>
            </div>

            <TaskInfoModal
                task={selectedTask}
                users={users}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedTask(null);
                }}
            />
        </AppLayout>
    );
}
