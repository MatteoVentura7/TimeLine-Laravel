import { router as Inertia } from '@inertiajs/core'
import type { Task, User } from '@/types/task-user'
import TaskTable from './TaskTable'

interface TableUserProps {
    tasks: Task[]
    users: User[]
    showEdit?: boolean
}

export default function TableUser({ tasks, users, showEdit = false }: TableUserProps) {
    return (
        <div className="flex h-full flex-col">
            <TaskTable
                tasks={tasks}
                users={users}
                showEdit={showEdit}
                onUpdateTask={(updatedTask) => {
                    // Aggiorna la task via Inertia
                    Inertia.patch(`/tasks/${updatedTask.id}`, {
                        title: updatedTask.title,
                        user_id: updatedTask.user?.id ?? null,
                        completed_at: updatedTask.completed_at_iso,
                    })
                }}
                onDeleteTask={(taskId) => {
                    // Cancella la task via Inertia
                    Inertia.delete(`/tasks/${taskId}`)
                }}
            />
        </div>
    )
}
