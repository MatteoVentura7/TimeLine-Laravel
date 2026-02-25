import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import type { Task } from '@/types/task-user';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from './modal';
import { Button } from '@/components/ui/button';

interface AddSubtaskModalProps {
    open: boolean;
    task: Task | null;
    onClose: () => void;
}

export default function AddSubtaskModal({
    open,
    task,
    onClose,
}: AddSubtaskModalProps) {
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !subtaskTitle.trim()) return;

        setLoading(true);

        router.post(
            `/tasks/${task.id}/subtasks`,
            { title: subtaskTitle },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSubtaskTitle('');
                    onClose();
                    router.reload({ only: ['tasks'] });
                },
                onError: () => {
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                setSubtaskTitle('');
                onClose();
            }}
            title="Add Subtask"
            width="w-[600px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                        <i className="fa-solid fa-list-check text-blue-500"></i>
                        <span>{task?.title}</span>
                    </h3>

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Subtask
                    </label>
                    <input
                        type="text"
                        value={subtaskTitle}
                        onChange={(e) => setSubtaskTitle(e.target.value)}
                        placeholder="Subtask title"
                        required
                        disabled={loading}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700"
                        autoFocus
                    />

                    {/* Show existing subtasks */}
                    {task && task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-4">
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue="item-1"
                                className="rounded-lg border bg-gray-50 dark:bg-neutral-800"
                            >
                                <AccordionItem
                                    value="item-1"
                                    className="border-none"
                                >
                                    <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                                        Existing Subtasks (
                                        {task.subtasks.length})
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4">
                                        <ul className="space-y-2">
                                            {task.subtasks.map((st) => (
                                                <li
                                                    key={st.id}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <i
                                                        className={`fa-regular ${
                                                            st.completed
                                                                ? 'fa-square-check text-green-500'
                                                                : 'fa-square text-gray-400'
                                                        }`}
                                                    />
                                                    <span
                                                        className={
                                                            st.completed
                                                                ? 'text-gray-500 line-through'
                                                                : ''
                                                        }
                                                    >
                                                        {st.title}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setSubtaskTitle('');
                            onClose();
                        }}
                        disabled={loading}
                        className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    >
                        Cancel
                    </button>
                 
                       <Button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    size="lg"
                > {loading ? 'Adding...' :   <>
                                        <i className="fa-solid fa-plus mr-2"></i>
                                        Add Subtask
                                    </>}</Button>
                </div>
            </form>
        </Modal>
    );
}
