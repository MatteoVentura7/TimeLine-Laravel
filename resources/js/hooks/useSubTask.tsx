import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { SubTask } from '@/types/task-user';

interface UseSubTasksProps {
    taskId: number;
    initialSubtasks: SubTask[];
}

export function useSubTasks({ taskId, initialSubtasks }: UseSubTasksProps) {
    const [subtasks, setSubtasks] = useState<SubTask[]>(initialSubtasks);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sync with prop changes
    useEffect(() => {
        setSubtasks(initialSubtasks);
    }, [initialSubtasks]);

    const addSubTask = (title: string) => {
        setLoading(true);

        router.post(
            `/tasks/${taskId}/subtasks`,
            { title },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowForm(false);
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

    const toggleSubTask = (id: number) => {
        const previous = subtasks;

        // Optimistic update
        setSubtasks((prev) =>
            prev.map((st) =>
                st.id === id ? { ...st, completed: !st.completed } : st,
            ),
        );

        router.patch(
            `/subtasks/${id}/toggle`,
            {},
            {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setSubtasks(previous);
                },
            },
        );
    };

    const deleteSubTask = (id: number) => {
        const previous = subtasks;

        // Optimistic update
        setSubtasks((prev) => prev.filter((st) => st.id !== id));

        router.delete(`/subtasks/${id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                router.reload({ only: ['tasks'] });
            },
            onError: () => {
                // Revert on error
                setSubtasks(previous);
            },
        });
    };

    return {
        subtasks,
        showForm,
        loading,
        setShowForm,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
    };
}