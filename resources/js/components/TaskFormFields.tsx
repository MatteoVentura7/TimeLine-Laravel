import type { User, Task } from '@/types/task-user';

interface TaskFormFieldsProps {
    isEditing: boolean;
    task: Task;
    title: string;
    userId: number | '';
    completed: boolean;
    completedAt: string;
    expiration: string;
    createdAt: string;
    users: User[];
    errors: {
        expiration: string;
        completed: string;
        created: string;
    };
    onTitleChange: (value: string) => void;
    onUserChange: (value: number | '') => void;
    onCompletedChange: () => void;
    onCompletedAtChange: (value: string) => void;
    onExpirationChange: (value: string) => void;
    onCreatedAtChange: (value: string) => void;
}

export default function TaskFormFields({
    isEditing,
    task,
    title,
    userId,
    completed,
    completedAt,
    expiration,
    createdAt,
    users,
    errors,
    onTitleChange,
    onUserChange,
    onCompletedChange,
    onCompletedAtChange,
    onExpirationChange,
    onCreatedAtChange,
}: TaskFormFieldsProps) {
    const selectedUser = users.find((u) => u.id === userId) ?? task.user;

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm transition dark:bg-neutral-700">
                {isEditing ? (
                    <div className="flex w-full items-center gap-2">
                        <i className="fa-solid fa-list-check text-blue-500"></i>
                        <input
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500"
                            placeholder="Task title"
                        />
                    </div>
                ) : (
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                        <i
                            className={`fa-solid fa-list-check ${
                                completed ? 'text-green-500' : 'text-blue-500'
                            }`}
                        ></i>
                        {title}
                    </h3>
                )}
            </div>

            {/* User + Status */}
            <div className="flex flex-wrap items-center gap-3">
                {isEditing ? (
                    <select
                        value={userId}
                        onChange={(e) =>
                            onUserChange(e.target.value ? Number(e.target.value) : '')
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    >
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition dark:bg-blue-900 dark:text-blue-100">
                        <i className="fa-solid fa-user"></i>
                        {selectedUser?.name ?? 'Unassigned'}
                    </span>
                )}

                <button
                    onClick={onCompletedChange}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                        completed
                            ? 'text-green-500 hover:text-green-600 cursor-pointer'
                            : 'text-gray-600'
                    } ${!isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:text-green-500'}`}
                    title={completed ? 'Undo complete' : 'Complete task'}
                >
                    {completed ? (
                        <i className="fa-solid fa-square-check text-2xl"></i>
                    ) : (
                        <i className="fa-regular fa-square text-2xl"></i>
                    )}
                    <span>{completed ? 'Completed' : 'Not Completed'}</span>
                </button>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* Created at */}
                <div className="rounded-lg border bg-gray-50 p-3 shadow-sm dark:bg-neutral-800">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Created at
                    </p>
                    {isEditing ? (
                        <>
                            <input
                                type="datetime-local"
                                value={createdAt}
                                onChange={(e) => onCreatedAtChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                            />
                            {errors.created && (
                                <p className="mt-1 text-sm text-red-500">{errors.created}</p>
                            )}
                        </>
                    ) : (
                        <p className="font-medium dark:text-gray-200">
                            {task.created_at_formatted}
                        </p>
                    )}
                </div>

                {/* Expiration */}
                <div className="rounded-lg border bg-gray-50 p-3 shadow-sm dark:bg-neutral-800">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Expiration
                    </p>
                    {isEditing ? (
                        <>
                            <input
                                type="datetime-local"
                                value={expiration}
                                onChange={(e) => onExpirationChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                            />
                            {errors.expiration && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.expiration}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="font-medium dark:text-gray-200">
                            {task.expiration_formatted ?? '—'}
                        </p>
                    )}
                </div>

                {/* Completed at */}
                <div className="rounded-lg border bg-gray-50 p-3 shadow-sm dark:bg-neutral-800">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Completed on {completed && isEditing ? '*' : ''}
                    </p>
                    {isEditing ? (
                        <>
                            <input
                                type="datetime-local"
                                value={completedAt || ''}
                                onChange={(e) => onCompletedAtChange(e.target.value)}
                                disabled={!completed}
                                className={`w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 ${
                                    !completed ? 'cursor-not-allowed bg-gray-100 dark:bg-neutral-900' : ''
                                }`}
                            />
                            {errors.completed && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.completed}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="font-medium dark:text-gray-200">
                            {task.completed ? task.completed_at_formatted : '—'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}