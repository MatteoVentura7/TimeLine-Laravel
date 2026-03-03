import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { User } from '@/types/task-user';
import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
    CalendarIcon,
    CalendarOff,
    Clock,
    FileText,
    Plus,
    UserIcon,
} from 'lucide-react';
import { useState } from 'react';

interface TaskFormProps {
    users: User[];
    onSuccess?: () => void;
}

function DateTimePicker({
    value,
    onChange,
    disabled = false,
    placeholder = 'Seleziona una data',
    minDate,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    minDate?: string;
}) {
    const [time, setTime] = useState(() => {
        if (!value) return '12:00';
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
    const minDateObj = minDate ? parseDate(minDate) : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        disabled && 'cursor-not-allowed opacity-50',
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
                <div className="space-y-3 p-3">
                    <Calendar
                        mode="single"
                        selected={displayDate}
                        onSelect={handleDateSelect}
                        autoFocus
                        disabled={
                            disabled
                                ? true
                                : minDateObj
                                  ? { before: minDateObj }
                                  : false
                        }
                        locale={it}
                    />
                    <div className="space-y-2 border-t pt-3">
                        <Label className="text-sm font-medium">Ora</Label>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) =>
                                    handleTimeChange(e.target.value)
                                }
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

export default function TaskForm({ users, onSuccess }: TaskFormProps) {
    const { data, setData, post, reset, processing } = useForm({
        title: '',
        user_id: '',
        start: '',
        expiration: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        post(`/tasks${queryParams({})}`, {
            preserveState: false,
            onSuccess: () => {
                reset();
                setSubmitted(false);
                onSuccess?.();
                router.reload({ only: ['tasks', 'statistic'] });
            },
        });
    };

    const isDisabled = processing || submitted;

    return (
        <div>
            <CardHeader className="w-full border-b pb-3 text-center dark:border-neutral-700">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Activity
                </CardTitle>
                <CardDescription className="whitespace-nowrap">
                    Add a new activity to your workflow
                </CardDescription>
            </CardHeader>
            <form onSubmit={submit} className="mt-3 flex justify-center">
                <fieldset disabled={isDisabled} className="space-y-4">
                    {/* Activity */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" /> Activity
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Enter activity..."
                            required
                            className="max-w-64 [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50"
                        />
                    </div>

                    {/* Assigned User */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="user_id"
                            className="flex items-center gap-2"
                        >
                            <UserIcon className="h-4 w-4" /> Assigned To
                        </Label>
                        <Select
                            value={data.user_id}
                            onValueChange={(value) => setData('user_id', value)}
                            required
                        >
                            <SelectTrigger className="max-w-64 [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50">
                                <SelectValue placeholder="Select user..." />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={user.id.toString()}
                                    >
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Start Date */}
                    <div className="flex gap-2">
                        <div className="max-w-31 space-y-2 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24">
                            <Label
                                htmlFor="start"
                                className="flex items-center gap-2"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                Start
                            </Label>
                            <DateTimePicker
                                value={data.start}
                                onChange={(value) => setData('start', value)}
                                placeholder="Date start"
                            />
                        </div>

                        {/* Expiration Date */}
                        <div className="max-w-31 space-y-2 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24">
                            <Label
                                htmlFor="expiration"
                                className="flex items-center gap-2"
                            >
                                <CalendarOff className="h-4 w-4" />
                                Expiration
                            </Label>
                            <DateTimePicker
                                value={data.expiration}
                                onChange={(value) =>
                                    setData('expiration', value)
                                }
                                disabled={!data.start}
                                minDate={data.start}
                                placeholder="Date end"
                            />
                            {!data.start && (
                                <p className="text-xs text-muted-foreground">
                                    Select a start date first
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className="w-64 cursor-pointer bg-black [@media(max-width:1023px)]:w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50"
                        size="lg"
                    >
                        {processing ? (
                            <>
                                {' '}
                                <Spinner /> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-plus mr-2"></i>
                                Add activity
                            </>
                        )}
                    </Button>
                </fieldset>
            </form>
        </div>
    );
}




