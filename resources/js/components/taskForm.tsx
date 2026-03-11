import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DateTimePicker from '@/components/ui/date-time-picker';
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
    Paperclip,
    Plus,
    UserIcon,
    X,
} from 'lucide-react';

import { useRef, useState } from 'react';


interface TaskFormProps {
    users: User[];
    onSuccess?: () => void;
}

export default function TaskForm({ users, onSuccess }: TaskFormProps) {
    const { data, setData, reset, processing } = useForm({
        title: '',
        user_id: '',
        start: '',
        expiration: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('user_id', data.user_id);
        formData.append('start', data.start);
        formData.append('expiration', data.expiration);
        selectedFiles.forEach(file => formData.append('files[]', file));

        router.post(`/tasks${queryParams({})}`, formData as any, {
            preserveState: false,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setSelectedFiles([]);
                setSubmitted(false);
                onSuccess?.();
                router.reload({ only: ['tasks', 'statistic'] });
            },
            onError: () => {
                setSubmitted(false);
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
                    <div className="flex gap-2">
                        {/* Activity */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="flex items-center gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Activity
                            </Label>

                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter activity..."
                                required
                                className="w-80 [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50"
                            />
                        </div>

                        {/* Assigned User */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="user_id"
                                className="flex items-center gap-2"
                            >
                                <UserIcon className="h-4 w-4" />
                                Assigned To
                            </Label>

                            <Select
                                value={data.user_id}
                                onValueChange={(value) =>
                                    setData('user_id', value)
                                }
                                required
                            >
                                <SelectTrigger className="w-80 [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50">
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
                    </div>

                    {/* Dates */}
                    <div className="flex gap-2">
                        {/* Start */}
                        <div className="w-80 space-y-2 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24">
                            <Label className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Start
                            </Label>

                            <DateTimePicker
                                value={data.start}
                                onChange={(value) => setData('start', value)}
                                placeholder="Date start"
                            />
                        </div>

                        {/* Expiration */}
                        <div className="w-80 space-y-2 [@media(max-width:1023px)]:max-w-31 [@media(min-width:1024px)_and_(max-width:1200px)]:w-24">
                            <Label className="flex items-center gap-2">
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

                    {/* File Attachments */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            Attachments
                        </Label>

                        <div
                            className="flex w-80 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-4 w-4 shrink-0" />
                            <span>Click to attach files…</span>
                        </div>

                        <input
                            ref={fileInputRef}
                            id="files"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {selectedFiles.length > 0 && (
                            <ul className="w-80 space-y-1 [@media(max-width:1023px)]:max-w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1 text-xs"
                                    >
                                        <span className="min-w-0 truncate pr-2">{file.name}</span>
                                        <span className="shrink-0 text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="ml-2 shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isDisabled}
                        className="w-64 cursor-pointer bg-black [@media(max-width:1023px)]:w-64 [@media(min-width:1024px)_and_(max-width:1200px)]:w-50"
                        size="lg"
                    >
                        {processing ? (
                            <>
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
