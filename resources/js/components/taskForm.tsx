import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { User } from '@/types/task-user';
import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Spinner } from "@/components/ui/spinner"

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
        <form onSubmit={submit} className="mt-2 mb-2 space-y-4 p-4">
            <fieldset disabled={isDisabled} className="space-y-4">
                {/* Activity */}
                <div className="space-y-2">
                    <Label htmlFor="title">Activity</Label>
                    <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter activity..."
                        required
                        className="w-full"
                    />
                </div>

                {/* Assigned User */}
                <div className="space-y-2">
                    <Label htmlFor="user_id">Assigned To</Label>
                    <Select
                        value={data.user_id}
                        onValueChange={(value) => setData('user_id', value)}
                        required
                    >
                        <SelectTrigger className="w-full">
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
                <div className="space-y-2">
                    <Label htmlFor="start" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Start Date
                    </Label>
                    <Input
                        id="start"
                        type="datetime-local"
                        value={data.start}
                        onChange={(e) => setData('start', e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                    <Label
                        htmlFor="expiration"
                        className="flex items-center gap-2"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        Expiration Date
                    </Label>
                    <Input
                        id="expiration"
                        type="datetime-local"
                        value={data.expiration}
                        onChange={(e) => setData('expiration', e.target.value)}
                        min={data.start || undefined}
                        disabled={!data.start}
                        className="w-full"
                    />
                    {!data.start && (
                        <p className="text-xs text-muted-foreground">
                            Select a start date first
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700"
                    size="lg"
                >
                    {processing ? <> <Spinner/> Saving...</> : 'Add Activity'}
                </Button>
            </fieldset>
        </form>
    );
}
