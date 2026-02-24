import type { Task, User } from '@/types/task-user';
import { useEffect, useState } from 'react';
import AddSubtaskModal from './Addsubtaskmodal';
import CompleteTaskModal from './CompleteTaskModal';
import ConfirmDeleteModal from './confirmDeleteModal';
import IncompleteSubtasksWarningModal from './Incompletesubtaskswarningmodal';
import TaskInfoModal from './taskInfoModal';
import TaskTableHeader from './Tasktableheader';
import TaskTableRow from './Tasktablerow';

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
    // Info Modal
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Complete Modal
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [completedAt, setCompletedAt] = useState('');

    // Delete Confirmation
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    // Add Subtask Modal
    const [addSubtaskModalOpen, setAddSubtaskModalOpen] = useState(false);
    const [taskForSubtask, setTaskForSubtask] = useState<Task | null>(null);

    // Incomplete Subtasks Warning
    const [incompleteSubtasksWarning, setIncompleteSubtasksWarning] =
        useState(false);
    const [taskWithIncompleteSubtasks, setTaskWithIncompleteSubtasks] =
        useState<Task | null>(null);

    // Sync selected task when tasks update
    useEffect(() => {
        if (selectedTask) {
            const updated = tasks.find((t) => t.id === selectedTask.id);
            if (updated) setSelectedTask(updated);
        }
    }, [tasks, selectedTask]);

    // Auto-open task modal if openTaskId is provided
    useEffect(() => {
        if (openTaskId && tasks.length > 0) {
            const task = tasks.find((t) => t.id === openTaskId);
            if (task) {
                setSelectedTask(task);
                setInfoModalOpen(true);
                onTaskOpened?.();
            }
        }
    }, [openTaskId, tasks, onTaskOpened]);

    // Handlers
    const handleComplete = (task: Task) => {
        if (task.completed) {
            // Uncomplete task
            onUpdateTask({
                ...task,
                completed: false,
                completed_at_iso: null,
            });
        } else {
            // Check for incomplete subtasks
            const hasIncompleteSubtasks = task.subtasks?.some(
                (st) => !st.completed,
            );
            if (hasIncompleteSubtasks) {
                setTaskWithIncompleteSubtasks(task);
                setIncompleteSubtasksWarning(true);
            } else {
                openCompleteModal(task);
            }
        }
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

    const handleOpenInfo = (task: Task) => {
        setSelectedTask(task);
        setInfoModalOpen(true);
    };

    const handleDelete = (taskId: number) => {
        setTaskToDelete(taskId);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!taskToDelete) return;
        onDeleteTask(taskToDelete);
        setTaskToDelete(null);
        setConfirmOpen(false);
    };

    const handleAddSubtask = (task: Task) => {
        setTaskForSubtask(task);
        setAddSubtaskModalOpen(true);
    };

    // Empty state
    if (tasks.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-center justify-center">
                <img
                    src="/9264828.jpg"
                    className="max-w-36 opacity-90"
                    alt="No tasks"
                />
                <p className="mt-4 text-xl text-gray-500">
                    No activity found 🎉
                </p>
            </div>
        );
    }

    return (
        <div className="m-4 overflow-x-auto">
            <table className="w-full border-collapse rounded-xl bg-white shadow dark:bg-neutral-800">
                <TaskTableHeader />
                <tbody>
                    {tasks.map((task) => (
                        <TaskTableRow
                            key={task.id}
                            task={task}
                            onComplete={handleComplete}
                            onAddSubtask={handleAddSubtask}
                            onOpenInfo={handleOpenInfo}
                            onDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>

            {/* Modals */}
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

            <AddSubtaskModal
                open={addSubtaskModalOpen}
                task={taskForSubtask}
                onClose={() => {
                    setAddSubtaskModalOpen(false);
                    setTaskForSubtask(null);
                }}
            />

            <IncompleteSubtasksWarningModal
                open={incompleteSubtasksWarning}
                subtasks={taskWithIncompleteSubtasks?.subtasks || []}
                onClose={() => {
                    setIncompleteSubtasksWarning(false);
                    setTaskWithIncompleteSubtasks(null);
                }}
                onConfirm={() => {
                    setIncompleteSubtasksWarning(false);
                    if (taskWithIncompleteSubtasks) {
                        openCompleteModal(taskWithIncompleteSubtasks);
                    }
                    setTaskWithIncompleteSubtasks(null);
                }}
            />
        </div>
    );
}
