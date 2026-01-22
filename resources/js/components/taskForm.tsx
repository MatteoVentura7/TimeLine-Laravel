import { queryParams } from '@/wayfinder';
import { router, useForm } from '@inertiajs/react';
import Modal from './modal';

interface User {
    id: number;
    name: string;
}

interface TaskFormProps {
    users: User[];
    open: boolean;
    onClose: () => void;
}

export default function TaskForm({ users, open, onClose }: TaskFormProps) {
    const { data, setData, post, reset } = useForm({
        title: '',
        user_id: '',
        start: '',
        expiration: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/tasks${queryParams({})}`, {
            preserveState: false,
            onSuccess: () => {
                reset();
                onClose(); // 👈 chiude il modal
                router.reload({ only: ['tasks', 'statistic'] });
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="New activity"
            width="w-[480px]"
        >
            <form onSubmit={submit} className="flex flex-col gap-3">
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
                    <label className="mb-1 block font-semibold">
                        Expiration
                    </label>
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
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                >
                    Add
                </button>
            </form>
        </Modal>
    );
}
