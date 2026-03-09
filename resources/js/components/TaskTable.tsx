import type { Task, User } from '@/types/task-user';
import { useState, useEffect } from 'react';
import CompleteTaskModal from './CompleteTaskModal';
import ConfirmDeleteModal from './confirmDeleteModal';
import TaskInfoModal from './taskInfoModal';
import IncompleteSubtasksWarningModal from './InCompleteSubtasksWarningModal';
import AddSubtaskModal from './AddSubtaskModal';
import TaskTableHeaderModern from './TaskTableHeader';
import TaskTableRowModern from './TaskTableRow';
import { Table, TableBody } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

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
    const [incompleteSubtasksWarning, setIncompleteSubtasksWarning] = useState(false);
    const [taskWithIncompleteSubtasks, setTaskWithIncompleteSubtasks] = useState<Task | null>(null);

    
    useEffect(() => {
        if (selectedTask) {
            const updated = tasks.find((t) => t.id === selectedTask.id);
            if (updated) setSelectedTask(updated);
        }
    }, [tasks, selectedTask]);

    
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

    
    const handleComplete = (task: Task) => {
        if (task.completed) {
           
            onUpdateTask({
                ...task,
                completed: false,
                completed_at_iso: null,
            });
        } else {
          
            const hasIncompleteSubtasks = task.subtasks?.some((st) => !st.completed);
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

   
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className=" p-6 mb-4">
                    <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                    Get started by creating your first task
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className='border'>
                <Table>
                    <TaskTableHeaderModern />
                    <TableBody>
                        {tasks.map((task) => (
                            <TaskTableRowModern
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                                onAddSubtask={handleAddSubtask}
                                onOpenInfo={handleOpenInfo}
                                onDelete={handleDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

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