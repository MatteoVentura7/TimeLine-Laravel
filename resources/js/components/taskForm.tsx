import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TaskForm() {
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        const url = `/tasks${queryParams({})}`;
        post(url, {
            preserveState: false,
            onSuccess: () => {
                reset();
                router.reload({ only: ['tasks', 'statistc'] });
            },
            onFinish: () => setIsAdding(false),
        });
    };

    const { data, setData, post, reset } = useForm({ title: '' });
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div>
            <h1 className="mt-5 text-center text-3xl font-bold text-blue-500">
                Add activity form
            </h1>
            <form onSubmit={submit} className="m-8 mb-4 flex flex-col gap-2">
                <input
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Add activity..."
                    className="w-full grow rounded border border-gray-300 p-2"
                    required
                />
                <button
                    type="submit"
                    disabled={isAdding}
                    className="mt-2 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isAdding ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
}
