import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/task-user';
import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import {
    CalendarIcon,
    CalendarOff,
    FileText,
    Plus,
    UserIcon,
} from 'lucide-react';
import { useState } from 'react';

interface TaskFormProps {
    users: User[];
    onSuccess?: () => void;
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
            {' '}
            <CardHeader className="w-full border-b pb-3 text-center dark:border-neutral-700">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Activity
                </CardTitle>
                <CardDescription className="whitespace-nowrap">
                    Add a new activity to your workflow
                </CardDescription>
            </CardHeader>
            <form onSubmit={submit} className="mt-2 flex justify-center">
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
                        <div className="space-y-2">
                            <Label
                                htmlFor="start"
                                className="flex items-center gap-2"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                Start
                            </Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={data.start}
                                onChange={(e) =>
                                    setData('start', e.target.value)
                                }
                                className="max-w-31 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24"
                            />
                        </div>

                        {/* Expiration Date */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="expiration"
                                className="flex items-center gap-2"
                            >
                                <CalendarOff className="h-4 w-4" />
                                Expiration
                            </Label>
                            <Input
                                id="expiration"
                                type="datetime-local"
                                value={data.expiration}
                                onChange={(e) =>
                                    setData('expiration', e.target.value)
                                }
                                min={data.start || undefined}
                                disabled={!data.start}
                                className="max-w-31 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24"
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
