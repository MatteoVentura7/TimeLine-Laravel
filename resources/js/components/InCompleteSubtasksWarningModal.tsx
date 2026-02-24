import Modal from '@/components/modal';
import type { SubTask } from '@/types/task-user';

interface IncompleteSubtasksWarningModalProps {
    open: boolean;
    subtasks: SubTask[];
    onClose: () => void;
    onConfirm: () => void;
}

export default function IncompleteSubtasksWarningModal({
    open,
    subtasks,
    onClose,
    onConfirm,
}: IncompleteSubtasksWarningModalProps) {
    const incompleteSubtasks = subtasks.filter(st => !st.completed);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="⚠️ Incomplete Subtasks"
            width="w-[500px]"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                    >
                        Complete Anyway
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                    This task has <strong>{incompleteSubtasks.length} incomplete subtask{incompleteSubtasks.length !== 1 ? 's' : ''}</strong>. Are you sure you want to mark it as complete?
                </p>
                
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <h4 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                        Incomplete Subtasks:
                    </h4>
                    <ul className="space-y-1">
                        {incompleteSubtasks.map(st => (
                            <li 
                                key={st.id} 
                                className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200"
                            >
                                <i className="fa-regular fa-square text-amber-600" />
                                <span>{st.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}