import { useState } from 'react';
import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

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
        <form onSubmit={submit} className="space-y-6">
            <fieldset disabled={isDisabled} className="space-y-4">
                {/* Activity */}
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700">
                        Activity
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter activity..."
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500 shadow-sm transition"
                    />
                </div>

                {/* Assigned User */}
                <div className="flex flex-col">
                    <label htmlFor="user_id" className="mb-1 text-sm font-medium text-gray-700">
                        Assigned
                    </label>
                    <select
                        id="user_id"
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500 shadow-sm transition"
                    >
                        <option value="">Select user...</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start */}
                <div className="flex flex-col">
                    <label htmlFor="start" className="mb-1 text-sm font-medium text-gray-700">
                        Start
                    </label>
                    <input
                        id="start"
                        type="datetime-local"
                        value={data.start}
                        onChange={(e) => setData('start', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500 shadow-sm transition"
                    />
                </div>

                {/* Expiration */}
                <div className="flex flex-col">
                    <label htmlFor="expiration" className="mb-1 text-sm font-medium text-gray-700">
                        Expiration
                    </label>
                    <input
                        id="expiration"
                        type="datetime-local"
                        value={data.expiration}
                        onChange={(e) => setData('expiration', e.target.value)}
                        min={data.start || undefined}
                        disabled={!data.start}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500 shadow-sm transition
                                   disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium
                               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400
                               disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    {processing ? 'Saving...' : 'Add Task'}
                </button>
            </fieldset>
        </form>
    );
}
