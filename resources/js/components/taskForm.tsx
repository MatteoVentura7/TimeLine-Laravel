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
        <form onSubmit={submit}>
            <fieldset disabled={isDisabled} className="flex flex-col gap-3">
                <div>
                    <label className="mb-1 block font-semibold">Activity</label>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Add activity..."
                        className="w-full rounded border border-gray-300 p-2"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-semibold">Assigned</label>
                    <select
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        className="w-full rounded border border-gray-300 p-2"
                        required
                    >
                        <option value="">Assign to...</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-semibold">Start</label>
                    <input
                        type="datetime-local"
                        value={data.start}
                        onChange={(e) => setData('start', e.target.value)}
                        className="w-full rounded border border-gray-300 p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-semibold">Expiration</label>
                    <input
                        type="datetime-local"
                        value={data.expiration}
                        onChange={(e) => setData('expiration', e.target.value)}
                        min={data.start || undefined}
                        disabled={!data.start}
                        className="w-full rounded border border-gray-300 p-2 disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isDisabled}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white
                               hover:bg-blue-700 disabled:opacity-50
                               disabled:cursor-not-allowed"
                >
                    {processing ? 'Saving...' : 'Add'}
                </button>
            </fieldset>
        </form>
    );
}
