import { useState } from 'react';

interface SubTaskFormProps {
    onSubmit: (title: string) => void;
    onCancel: () => void;
    loading: boolean;
}

export default function SubTaskForm({
    onSubmit,
    onCancel,
    loading,
}: SubTaskFormProps) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600"
                placeholder="New subtask"
                required
                disabled={loading}
                autoFocus
            />
            <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? '...' : 'Add'}
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="cursor-pointer rounded-lg bg-gray-500 px-3 py-1 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-600 dark:hover:bg-neutral-500"
            >
                Cancel
            </button>
        </form>
    );
}