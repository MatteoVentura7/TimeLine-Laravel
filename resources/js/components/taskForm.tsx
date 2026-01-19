import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

export default function TaskForm({ users }: { users: User[] }) {
    const { data, setData, post, reset } = useForm({
        title: '',
        user_id: '',
    });

    const [isAdding, setIsAdding] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        post(`/tasks${queryParams({})}`, {
            preserveState: false,
            onSuccess: () => {
                reset();
                router.reload({ only: ['tasks', 'statistic'] });
            },
            onFinish: () => setIsAdding(false),
        });
    };

    return (
        <form onSubmit={submit} className="m-8 mb-4 flex flex-col gap-2">
            <input
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Add activity..."
                className="w-full rounded border border-gray-300 p-2"
                required
            />

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

            <button
                type="submit"
                disabled={isAdding}
                className="mt-2 rounded bg-blue-500 px-4 py-2 text-white
                           hover:bg-blue-600 disabled:opacity-50"
            >
                {isAdding ? 'Adding...' : 'Add'}
            </button>
        </form>
    );
}
