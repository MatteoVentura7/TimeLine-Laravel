import type { Task, User } from '@/types/task-user';
import { router as Inertia } from '@inertiajs/core';
import TaskTable from './TaskTable';

interface TableUserProps {
    tasks: Task[];
    users: User[];
    showEdit?: boolean;
    onEditChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TableUser({
    tasks,
    users,
    showEdit = false,
}: TableUserProps) {
    return (
        <div className="flex h-full flex-col">
            <TaskTable
                tasks={tasks}
                users={users}
                showEdit={showEdit}
                onUpdateTask={(updatedTask) => {
                    // Aggiorna la task via Inertia con opzioni per preservare lo stato
                    Inertia.patch(
                        `/tasks/${updatedTask.id}`,
                        {
                            title: updatedTask.title,
                            user_id: updatedTask.user?.id ?? null,
                            completed: updatedTask.completed,
                            completed_at: updatedTask.completed_at_iso,
                        },
                        {
                            // Preserva la posizione dello scroll
                            preserveScroll: true,
                            // Preserva lo stato corrente (form aperti, modal, ecc.)
                            preserveState: true,
                            // Dopo il successo, ricarica solo i dati necessari
                            onSuccess: () => {
                                Inertia.reload({ only: ['tasks', 'statistc'] });
                            },
                        }
                    );
                }}
                onDeleteTask={(taskId) => {
                    // Cancella la task via Inertia con opzioni per preservare lo stato
                    Inertia.delete(`/tasks/${taskId}`, {
                        // Preserva la posizione dello scroll
                        preserveScroll: true,
                        // Preserva lo stato corrente
                        preserveState: true,
                        // Dopo il successo, ricarica solo i dati necessari
                        onSuccess: () => {
                            Inertia.reload({ only: ['tasks', 'statistc'] });
                        },
                    });
                }}
            />
        </div>
    );
}