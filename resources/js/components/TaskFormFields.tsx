import { Button } from '@/components/ui/button';
import type { Task, User } from '@/types/task-user';
import { Calendar as CalendarIcon, CalendarCheck, CalendarOff, CheckCircle2, Circle, UserIcon, Clock } from 'lucide-react';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from 'react';

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

function DateTimePicker({ 
    value, 
    onChange, 
    disabled = false,
    placeholder = "Seleziona una data"
}: { 
    value: string; 
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}) {
    const [time, setTime] = useState(() => {
        if (!value) return "12:00";
        const date = new Date(value);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    });

    const parseDate = (dateString: string): Date | undefined => {
        if (!dateString) return undefined;
        return new Date(dateString);
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            onChange('');
            return;
        }

       
        const [hours, minutes] = time.split(':');
        selectedDate.setHours(parseInt(hours), parseInt(minutes));
        onChange(selectedDate.toISOString().slice(0, 16));
    };

    const handleTimeChange = (newTime: string) => {
        setTime(newTime);
      
        if (value) {
            const date = new Date(value);
            const [hours, minutes] = newTime.split(':');
            date.setHours(parseInt(hours), parseInt(minutes));
            onChange(date.toISOString().slice(0, 16));
        }
    };

    const displayDate = value ? parseDate(value) : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        format(displayDate!, "PPP 'alle' HH:mm", { locale: it })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 space-y-3">
                    <Calendar
                        mode="single"
                        selected={displayDate}
                        onSelect={handleDateSelect}
                        autoFocus
                        disabled={disabled}
                        locale={it}
                    />
                    <div className="border-t pt-3 space-y-2">
                        <Label className="text-sm font-medium">Ora</Label>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(e.target.value)}
                                className="flex-1"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
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
                            disabled={!isEditing}
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
                            onChange={(e) => onTitleChange(e.target.value)}
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

            {/* User + Status */}
            <div className="flex flex-wrap items-center gap-3 p-3 pl-1">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                            <UserIcon className="h-4 w-4" />
                        </div>
                        <Select
                            value={userId.toString()}
                            onValueChange={(value) => onUserChange(Number(value))}
                        >
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 text-xs font-semibold">
                                                    {u.name.charAt(0).toUpperCase()}
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
                        <span className="text-sm"> {selectedUser?.name ?? 'Unassigned'}</span>
                    </div>
                )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* Created at */}
                <div className="p-3 dark:bg-neutral-800">
                    <span className="flex items-center mb-3">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Start
                        </p>
                    </span>

                    {isEditing ? (
                        <div className="space-y-2">
                            <DateTimePicker
                                value={createdAt}
                                onChange={onCreatedAtChange}
                                placeholder="Seleziona data di inizio"
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
                    <span className="flex items-center mb-3">
                        <CalendarOff className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Expiration
                        </p>
                    </span>
                    {isEditing ? (
                        <div className="space-y-2">
                            <DateTimePicker
                                value={expiration}
                                onChange={onExpirationChange}
                                placeholder="Seleziona data di scadenza"
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

                {/* Completed at */}
                <div className="p-3 dark:bg-neutral-800">
                    <span className="flex items-center mb-3">
                        <CalendarCheck className="h-4 w-4 mr-2" />
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
                                placeholder="Seleziona data di completamento"
                            />
                            {errors.completed && (
                                <p className="text-sm text-red-500">
                                    {errors.completed}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="font-medium dark:text-gray-200">
                            {task.completed ? task.completed_at_formatted : '—'}
                        </p>
                    )}
                </div>
            </div>
            </CardContent>
        </div>
        </Card>
    );
}