import { Button } from '@/components/ui/button';
import type { Task, User } from '@/types/task-user';
import {
    CalendarCheck,
    Calendar as CalendarIcon,
    CalendarOff,
    CheckCircle2,
    Circle,
    UserIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import DateTimePicker from '@/components/ui/date-time-picker';

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
        <Card>
            <div className="space-y-6">
                <CardContent>
                    {/* Title */}
                    <div className="flex items-center justify-between p-3 pl-1 dark:bg-neutral-700">
                        {isEditing ? (
                            <div className="flex w-full items-center gap-2">
                                <Button
                                    onClick={onCompletedChange}
                                    variant="ghost"
                                    size="lg"
                                    className={`h-8 w-8 cursor-pointer p-0 ${
                                        completed
                                            ? 'text-green-600 hover:text-green-700'
                                            : 'text-gray-400 hover:text-green-600'
                                    }`}
                                >
                                    {completed ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <Circle className="h-5 w-5" />
                                    )}
                                </Button>

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        onTitleChange(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-500 dark:bg-neutral-600"
                                    placeholder="Task title"
                                />
                            </div>
                        ) : (
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className={`h-8 w-8 p-0 ${
                                        task.completed
                                            ? 'text-green-600 hover:text-green-700'
                                            : 'text-gray-400 hover:text-green-600'
                                    }`}
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <Circle className="h-5 w-5" />
                                    )}
                                </Button>

                                {title}
                            </h3>
                        )}
                    </div>

                    {/* User */}
                    <div className="flex flex-wrap items-center gap-3 p-3 pl-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                                    <UserIcon className="h-4 w-4" />
                                </div>

                                <Select
                                    value={userId.toString()}
                                    onValueChange={(value) =>
                                        onUserChange(Number(value))
                                    }
                                >
                                    <SelectTrigger className="w-50">
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            {users.map((u) => (
                                                <SelectItem
                                                    key={u.id}
                                                    value={u.id.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                                                            {u.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <span>{u.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                                    <UserIcon className="h-4 w-4" />
                                </div>

                                <span className="text-sm">
                                    {selectedUser?.name ?? 'Unassigned'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {/* Start */}
                        <div className="p-3 dark:bg-neutral-800">
                            <span className="mb-3 flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Start
                                </p>
                            </span>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <DateTimePicker
                                        value={createdAt}
                                        onChange={onCreatedAtChange}
                                        placeholder="Select date of start"
                                    />

                                    {errors.created && (
                                        <p className="text-sm text-red-500">
                                            {errors.created}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="font-medium dark:text-gray-200">
                                    {task.created_at_formatted}
                                </p>
                            )}
                        </div>

                        {/* Expiration */}
                        <div className="p-3 dark:bg-neutral-800">
                            <span className="mb-3 flex items-center">
                                <CalendarOff className="mr-2 h-4 w-4" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Expiration
                                </p>
                            </span>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <DateTimePicker
                                        value={expiration}
                                        onChange={onExpirationChange}
                                        placeholder="Select date of expiration"
                                    />

                                    {errors.expiration && (
                                        <p className="text-sm text-red-500">
                                            {errors.expiration}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="font-medium dark:text-gray-200">
                                    {task.expiration_formatted ?? '—'}
                                </p>
                            )}
                        </div>

                        {/* Completed */}
                        <div className="p-3 dark:bg-neutral-800">
                            <span className="mb-3 flex items-center">
                                <CalendarCheck className="mr-2 h-4 w-4" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Completed On
                                </p>
                            </span>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <DateTimePicker
                                        value={completedAt}
                                        onChange={onCompletedAtChange}
                                        disabled={!completed}
                                        placeholder="Select completion date"
                                    />

                                    {errors.completed && (
                                        <p className="text-sm text-red-500">
                                            {errors.completed}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="font-medium dark:text-gray-200">
                                    {task.completed
                                        ? task.completed_at_formatted
                                        : '—'}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
