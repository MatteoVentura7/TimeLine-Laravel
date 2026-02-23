import type { Task, User } from '@/types/task-user';
import { useState, useEffect } from 'react';
import CompleteTaskModal from './CompleteTaskModal';
import ConfirmDeleteModal from './confirmDeleteModal';
import TaskInfoModal from './taskInfoModal';
import Modal from './modal';
import { router } from '@inertiajs/react';
import { Spinner } from "@/components/ui/spinner"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface TaskTableProps {
    tasks: Task[];
    users: User[];
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: number) => void;
    showEdit?: boolean;
    openTaskId?: number | null;
    onTaskOpened?: () => void;
}

export default function TaskTable({
    tasks,
    users,
    onUpdateTask,
    onDeleteTask,
    showEdit = false,
    openTaskId,
    onTaskOpened,
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
    const [addSubtaskModalOpen, setAddSubtaskModalOpen] = useState(false);
    const [taskForSubtask, setTaskForSubtask] = useState<Task | null>(null);
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [subtaskLoading, setSubtaskLoading] = useState(false);

    useEffect(() => {
        if (selectedTask) {
            const updated = tasks.find((t) => t.id === selectedTask.id);
            if (updated) setSelectedTask(updated);
        }
    }, [tasks]);

    useEffect(() => {
        if (openTaskId && tasks.length > 0) {
            const task = tasks.find((t) => t.id === openTaskId);
            if (task) {
                setSelectedTask(task);
                setInfoModalOpen(true);
                onTaskOpened?.();
            }
        }
    }, [openTaskId, tasks]);

    const openAddSubtaskModal = (task: Task) => {
        setTaskForSubtask(task);
        setSubtaskTitle('');
        setAddSubtaskModalOpen(true);
    };

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForSubtask || !subtaskTitle.trim()) return;

        setSubtaskLoading(true);

        router.post(
            `/tasks/${taskForSubtask.id}/subtasks`,
            { title: subtaskTitle },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setAddSubtaskModalOpen(false);
                    setTaskForSubtask(null);
                    setSubtaskTitle('');
                    router.reload({ only: ['tasks'] });
                },
                onError: () => {
                    setSubtaskLoading(false);
                },
                onFinish: () => {
                    setSubtaskLoading(false);
                },
            },
        );
    };

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
        setCompletedAt('');
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
                        <th className="p-3 text-left"> <i className="pr-2 fa-solid fa-list-ul"></i>Title</th>
                        <th className="p-3 text-left">  <i className="pr-2 fa-solid fa-user"></i>To Assigned</th>
                        <th className="p-3 text-left"> <i className="pr-2 fa-solid fa-hourglass-start"></i>Start</th>
                        <th className="p-3 text-left"> <i className="pr-2 fa-solid fa-hourglass-end"></i>Expire</th>
                        <th className="p-3 text-left"> <i className="pr-2 fa-solid fa-check"></i>Completed On</th>
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
                                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                                            task.completed
                                                ? 'text-green-500 hover:text-green-600'
                                                : 'text-gray-600 hover:text-green-500'
                                        } `}
                                        title={
                                            task.completed
                                                ? 'Undo complete'
                                                : 'Complete task'
                                        }
                                    >
                                        {task.completed ? (
                                            <>
                                                <i className="fa-solid fa-square-check text-2xl"></i>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-regular fa-square text-2xl"></i>
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
                                    {task.completed
                                        ? task.completed_at_formatted
                                        : '—'}
                                </td>

                                <td className="p-3 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => openAddSubtaskModal(task)}
                                        className="mr-3 cursor-pointer text-green-500 hover:text-green-700"
                                        title="Add subtask"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
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
               
                onClose={() => {
                    setConfirmOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDelete}
            />

            {/* Add Subtask Modal */}
            <Modal
                open={addSubtaskModalOpen}
                onClose={() => {
                    setAddSubtaskModalOpen(false);
                    setTaskForSubtask(null);
                    setSubtaskTitle('');
                }}
                title="Add Subtask"
                width="w-[600px]"
            >
                <form onSubmit={handleAddSubtask} className="space-y-4">
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                            <i className="fa-solid fa-list-check text-blue-500"></i>
                            <span>{taskForSubtask?.title}</span>
                        </h3>
                        
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Subtask
                        </label>
                        <input
                            type="text"
                            value={subtaskTitle}
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                            placeholder="Subtask title"
                            required
                            disabled={subtaskLoading}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:border-neutral-600"
                            autoFocus
                        />
                        
                        {/* Show existing subtasks */}
                        {taskForSubtask && taskForSubtask.subtasks && taskForSubtask.subtasks.length > 0 && (
                            <div className="mt-4">
                                <Accordion
                                    type="single"
                                    collapsible
                                    defaultValue="item-1"
                                    className="rounded-lg border bg-gray-50 dark:bg-neutral-800"
                                >
                                    <AccordionItem value="item-1" className="border-none">
                                        <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                                            Existing Subtasks ({taskForSubtask.subtasks.length})
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <ul className="space-y-2">
                                                {taskForSubtask.subtasks.map((st) => (
                                                    <li
                                                        key={st.id}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <i
                                                            className={`fa-regular ${
                                                                st.completed
                                                                    ? 'fa-square-check text-green-500'
                                                                    : 'fa-square text-gray-400'
                                                            }`}
                                                        />
                                                        <span className={st.completed ? 'line-through text-gray-500' : ''}>
                                                            {st.title}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setAddSubtaskModalOpen(false);
                                setTaskForSubtask(null);
                                setSubtaskTitle('');
                            }}
                            disabled={subtaskLoading}
                            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={subtaskLoading}
                            className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {subtaskLoading ? <Spinner /> : 'Add'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}