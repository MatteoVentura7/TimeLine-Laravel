import type { Task, User } from '@/types/task-user';
import { useState } from 'react';
import CompleteTaskModal from './CompleteTaskModal';
import ConfirmDeleteModal from './confirmDeleteModal';
import TaskInfoModal from './taskInfoModal';

interface TaskTableProps {
    tasks: Task[];
    users: User[];
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: number) => void;
    showEdit?: boolean;
}

export default function TaskTable({
    tasks,
    users,
    onUpdateTask,
    onDeleteTask,
    showEdit = false,
}: TaskTableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editUserId, setEditUserId] = useState<number | ''>('');
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [completedAt, setCompletedAt] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const saveEdit = (task: Task) => {
        onUpdateTask({
            ...task,
            title: editTitle,
            user: users.find((u) => u.id === editUserId) ?? null,
        });
        setEditingId(null);
        setEditTitle('');
        setEditUserId('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditUserId('');
    };

    const openCompleteModal = (task: Task) => {
        setTaskToComplete(task);
        setCompletedAt(new Date().toISOString().slice(0, 16));
        setCompleteModalOpen(true);
    };

    const confirmComplete = () => {
        if (!taskToComplete) return;
        onUpdateTask({
            ...taskToComplete,
            completed: true,
            completed_at_iso: completedAt,
        });
        setTaskToComplete(null);
        setCompleteModalOpen(false);
    };

    const openInfoModal = (task: Task) => {
        setSelectedTask(task);
        setInfoModalOpen(true);
    };

    const removeTask = (taskId: number) => {
        setTaskToDelete(taskId);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete) return;
        onDeleteTask(taskToDelete);
        setTaskToDelete(null);
        setConfirmOpen(false);
    };

    const isEditing = (task: Task) => editingId === task.id;

    if (tasks.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-center justify-center">
                <img src="9264828.jpg" className="max-w-36 opacity-90" />
                <p className="mt-4 text-xl text-gray-500">
                    No activity found 🎉
                </p>
            </div>
        );
    }

    return (
        <div className="m-4 overflow-x-auto">
            <table className="w-full border-collapse rounded-xl bg-white shadow dark:bg-neutral-800">
                <thead>
                    <tr className="border-b dark:border-neutral-700">
                        <th className="p-3 text-left">Done</th>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Assigned To</th>
                        <th className="p-3 text-left">Created At</th>
                        <th className="p-3 text-left">Expire</th>
                        <th className="p-3 text-left">Completed On</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                        const isThisEditing = isEditing(task);
                        const createdAt = new Date(task.created_at_iso);
                        const isFutureTask = createdAt.getTime() > Date.now();

                        return (
                            <tr
                                key={task.id}
                                className={`border-b last:border-none dark:border-neutral-700 ${
                                    editingId !== null && !isThisEditing
                                        ? 'opacity-60'
                                        : ''
                                }`}
                            >
                                <td className="p-3">
                                    <button
                                        onClick={() => {
                                            if (task.completed) {
                                                onUpdateTask({
                                                    ...task,
                                                    completed: false,
                                                    completed_at_iso: null,
                                                });
                                            } else {
                                                openCompleteModal(task);
                                            }
                                        }}
                                        className={`flex items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                                            task.completed
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-200 text-gray-600 hover:bg-green-500 hover:text-white'
                                        } `}
                                        title={
                                            task.completed
                                                ? 'Undo complete'
                                                : 'Complete task'
                                        }
                                    >
                                        {task.completed ? (
                                            <>
                                                <i className="fa-solid fa-check"></i>
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-regular fa-circle"></i>
                                                Complete
                                            </>
                                        )}
                                    </button>
                                </td>

                                <td className="p-3">
                                  
                                        <span className="font-medium">
                                            {task.title}
                                        </span>
                                  
                                </td>

                                <td className="p-3">
                                   
                                        <span>{task.user?.name ?? '—'}</span>
                                    
                                </td>

                                <td className="p-3">
                                    {task.created_at_formatted}
                                </td>
                                <td className="p-3">
                                    {task.expiration_formatted ?? '—'}
                                </td>
                                <td className="p-3">
                                    {task.completed_at_formatted ?? '—'}
                                </td>

                                <td className="p-3 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => openInfoModal(task)}
                                        className="mr-3 cursor-pointer text-blue-500"
                                    >
                                        <i className="fa-solid fa-circle-info"></i>
                                    </button>
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="cursor-pointer text-red-500"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* MODALI */}
            <CompleteTaskModal
                open={completeModalOpen}
                task={taskToComplete}
                completedAt={completedAt}
                onChangeCompletedAt={setCompletedAt}
                onClose={() => {
                    setCompleteModalOpen(false);
                    setTaskToComplete(null);
                }}
                onConfirm={confirmComplete}
            />

            <TaskInfoModal
                task={selectedTask}
                users={users}
                open={infoModalOpen}
                onClose={() => {
                    setInfoModalOpen(false);
                    setSelectedTask(null);
                }}
            />

            <ConfirmDeleteModal
                open={confirmOpen}
                title="Confirm delete"
                message="Are you sure you want to delete this task?"
                onCancel={() => {
                    setConfirmOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
