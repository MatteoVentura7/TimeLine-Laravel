import { subtasksInfo } from '@/routes';
import type { SubTask } from '@/types/task-user';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Circle, Info, Trash2 } from 'lucide-react';

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
        <li className="flex items-center justify-between gap-2  text-sm">
            <div className="flex items-center gap-2">
                <button
                    disabled={disabled}
                    onClick={() => onToggle(subtask.id)}
                    className={`cursor-pointer disabled:cursor-not-allowed ${
                        subtask.completed
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-green-600'
                    }`}
                >
                    {subtask.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                </button>

                <span
                    className={
                        subtask.completed ? 'text-gray-500 line-through' : ''
                    }
                >
                    <p className="text-lg">{subtask.title}</p>
                </span>
            </div>

            <div className="flex gap-2">
                <Link
                    as="button"
                    disabled={disabled}
                    href={`${subtasksInfo(subtask.id).url}?from_task=${taskId}`}
                    className="cursor-pointer rounded-sm text-sm disabled:cursor-not-allowed"
                >
                    <Info
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
                    <Trash2
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
