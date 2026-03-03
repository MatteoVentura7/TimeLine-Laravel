import { Button } from '@/components/ui/button';
import { useSubTasks } from '@/hooks/useSubTask';
import type { Task } from '@/types/task-user';
import { useState } from 'react';
import ConfirmDeleteModal from './confirmDeleteModal';
import SubTaskForm from './SubTaskForm';
import SubTaskItem from './SubTaskItem';

interface SubTaskListProps {
    task: Task;
      disabled?: boolean;
}

export default function SubTaskList({ task, disabled }: SubTaskListProps) {
    const [open, setOpen] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [subtaskToDelete, setSubtaskToDelete] = useState<number | null>(null);

    const {
        subtasks,
        showForm,
        loading,
        setShowForm,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
    } = useSubTasks({
        taskId: task.id,
        initialSubtasks: task.subtasks,
    });

    const handleDelete = (id: number) => {
        setSubtaskToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!subtaskToDelete) return;
        deleteSubTask(subtaskToDelete);
        setSubtaskToDelete(null);
        setConfirmOpen(false);
    };

    return (
        <>
            <div className={`${disabled ? "pointer-events-none opacity-50" : ""} rounded-lg border bg-gray-50 dark:bg-neutral-800`}>
                {/* Accordion Header */}
                <button
                    onClick={() => setOpen(!open)}
                    disabled={showForm}
                    className="flex w-full items-center justify-between p-4 text-sm font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed dark:hover:bg-neutral-700"
                >
                    <span>Subtasks ({subtasks.length})</span>
                    <i
                        className={`fa-solid fa-chevron-down cursor-pointer transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                        } ${showForm ? 'text-gray-300' : ''}`}
                    />
                </button>

                {/* Accordion Body */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        open ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-4 pb-4">
                        {/* Subtask List */}
                        {subtasks.length > 0 && (
                            <ul className="mb-4 space-y-2">
                                {subtasks.map((st) => (
                                    <SubTaskItem
                                        key={st.id}
                                        subtask={st}
                                        taskId={task.id}
                                        disabled={showForm}
                                        onToggle={toggleSubTask}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </ul>
                        )}

                        {/* Add Form or Button */}
                        {showForm ? (
                            <SubTaskForm
                                onSubmit={addSubTask}
                                onCancel={() => setShowForm(false)}
                                loading={loading}
                            />
                        ) : (
                          
                            <Button
                                onClick={() => setShowForm(true)}
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {' '}
                                {loading ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        <i className="fa-solid fa-plus mr-2"></i>
                                        Add Subtask
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                open={confirmOpen}
                message="Are you sure you want to delete this subtask?"
                onClose={() => {
                    setConfirmOpen(false);
                    setSubtaskToDelete(null);
                }}
                onConfirm={confirmDelete}
            />
        </>
    );
}
