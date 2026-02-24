import type { Task } from '@/types/task-user';

interface TaskTableRowProps {
    task: Task;
    onComplete: (task: Task) => void;
    onAddSubtask: (task: Task) => void;
    onOpenInfo: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

export default function TaskTableRow({
    task,
    onComplete,
    onAddSubtask,
    onOpenInfo,
    onDelete,
}: TaskTableRowProps) {
    return (
        <tr className="border-b last:border-none dark:border-neutral-700">
            {/* Checkbox */}
            <td className="p-3">
                <button
                    onClick={() => onComplete(task)}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                        task.completed
                            ? 'text-green-500 hover:text-green-600'
                            : 'text-gray-600 hover:text-green-500'
                    }`}
                    title={task.completed ? 'Undo complete' : 'Complete task'}
                >
                    {task.completed ? (
                        <i className="fa-solid fa-square-check text-2xl"></i>
                    ) : (
                        <i className="fa-regular fa-square text-2xl"></i>
                    )}
                </button>
            </td>

            {/* Title */}
            <td className="p-3">
                <span className="font-medium">{task.title}</span>
            </td>

            {/* User */}
            <td className="p-3">
                <span>{task.user?.name ?? '—'}</span>
            </td>

            {/* Start Date */}
            <td className="p-3">{task.created_at_formatted}</td>

            {/* Expiration */}
            <td className="p-3">{task.expiration_formatted ?? '—'}</td>

            {/* Completed On */}
            <td className="p-3">
                {task.completed ? task.completed_at_formatted : '—'}
            </td>

            {/* Actions */}
            <td className="p-3 text-right whitespace-nowrap">
                <button
                    onClick={() => onAddSubtask(task)}
                    className="mr-3 cursor-pointer text-green-500 hover:text-green-700"
                    title="Add subtask"
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
                <button
                    onClick={() => onOpenInfo(task)}
                    className="mr-3 cursor-pointer text-blue-500"
                    title="Info activity"
                >
                    <i className="fa-solid fa-circle-info"></i>
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="cursor-pointer text-red-500"
                    title="Delete activity"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}
