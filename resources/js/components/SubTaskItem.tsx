import { Link } from '@inertiajs/react';
import { subtasksInfo } from '@/routes';
import type { SubTask } from '@/types/task-user';

interface SubTaskItemProps {
    subtask: SubTask;
    taskId: number;
    disabled: boolean;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function SubTaskItem({
    subtask,
    taskId,
    disabled,
    onToggle,
    onDelete,
}: SubTaskItemProps) {
    return (
        <li className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
                <button
                    disabled={disabled}
                    onClick={() => onToggle(subtask.id)}
                    className="cursor-pointer disabled:cursor-not-allowed"
                >
                    <i
                        className={`fa-regular ${
                            subtask.completed
                                ? 'fa-square-check text-green-500'
                                : 'fa-square text-gray-600'
                        } ${disabled ? 'text-gray-300' : ''}`}
                    />
                </button>

                <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                    {subtask.title}
                </span>
            </div>
            
            <div className="flex gap-2">
                <Link
                    as="button"
                    disabled={disabled}
                    href={`${subtasksInfo(subtask.id).url}?from_task=${taskId}`}
                    className="cursor-pointer rounded-sm text-sm disabled:cursor-not-allowed"
                >
                    <i
                        className={`fa-solid fa-circle-info ${
                            disabled
                                ? 'cursor-not-allowed text-gray-300'
                                : 'text-blue-500 hover:text-blue-700'
                        }`}
                    />
                </Link>

                <button
                    disabled={disabled}
                    onClick={() => onDelete(subtask.id)}
                    className="cursor-pointer disabled:cursor-not-allowed"
                >
                    <i
                        className={`fa-solid fa-trash ${
                            disabled
                                ? 'cursor-not-allowed text-gray-300'
                                : 'text-red-500 hover:text-red-700'
                        }`}
                    />
                </button>
            </div>
        </li>
    );
}