import { useState } from 'react';
import type { Task } from '@/types/task-user';
import ConfirmDeleteModal from './confirmDeleteModal';
import SubTaskItem from './Subtaskitem';
import SubTaskForm from './SubTaskForm';
import { useSubTasks } from '@/hooks/useSubTask';

interface SubTaskListProps {
    task: Task;
}

export default function SubTaskList({ task }: SubTaskListProps) {
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
            <div className="rounded-lg border bg-gray-50 dark:bg-neutral-800">
                {/* Accordion Header */}
                <button
                    onClick={() => setOpen(!open)}
                    disabled={showForm}
                    className="flex w-full items-center justify-between p-4 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-neutral-700 transition disabled:cursor-not-allowed"
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
                            <ul className="space-y-2 mb-4">
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
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full cursor-pointer rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 transition"
                            >
                                <i className="fa-solid fa-plus mr-2"></i>
                                Add subtask
                            </button>
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