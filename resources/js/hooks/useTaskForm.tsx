import { useState, useEffect } from 'react';
import type { Task } from '@/types/task-user';

interface UseTaskFormProps {
    task: Task | null;
}

interface ValidationErrors {
    expiration: string;
    completed: string;
    created: string;
}

export function useTaskForm({ task }: UseTaskFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [userId, setUserId] = useState<number | ''>('');
    const [completed, setCompleted] = useState(false);
    const [completedAt, setCompletedAt] = useState('');
    const [expiration, setExpiration] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({
        expiration: '',
        completed: '',
        created: '',
    });

    const isoToLocal = (iso: string | null) => {
        if (!iso) return '';
        const d = new Date(iso);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60_000);
        return local.toISOString().slice(0, 16);
    };

    // Initialize form when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setUserId(task.user?.id ?? '');
            setCompleted(task.completed);
            setCompletedAt(task.completed_at_iso ? isoToLocal(task.completed_at_iso) : '');
            setExpiration(task.expiration_iso ? isoToLocal(task.expiration_iso) : '');
            setCreatedAt(task.created_at_iso ? isoToLocal(task.created_at_iso) : '');
            resetEdit();
        }
    }, [task]);

    const resetEdit = () => {
        setIsEditing(false);
        setErrors({ expiration: '', completed: '', created: '' });
    };

    const cancelEdit = () => {
        if (!task) return;
        setTitle(task.title);
        setUserId(task.user?.id ?? '');
        setCompleted(task.completed);
        setCompletedAt(isoToLocal(task.completed_at_iso));
        setExpiration(isoToLocal(task.expiration_iso));
        setCreatedAt(isoToLocal(task.created_at_iso));
        resetEdit();
    };

    const validate = (): boolean => {
        if (!task) return false;

        const created = createdAt ? new Date(createdAt) : new Date(task.created_at_iso);
        const expDate = expiration ? new Date(expiration) : null;
        const compDate = completedAt ? new Date(completedAt) : null;

        const newErrors: ValidationErrors = { expiration: '', completed: '', created: '' };

        if (!createdAt) {
            newErrors.created = 'Creation date is required.';
        }

        if (expDate && expDate < created) {
            newErrors.expiration = 'Expiration date cannot be before creation date.';
        }

        if (completed && !completedAt) {
            newErrors.completed = 'Completion date is required.';
        }

        if (compDate && compDate < created) {
            newErrors.completed = 'Completed date cannot be before creation date.';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(err => err);
    };

    const getFormData = () => ({
        title,
        user_id: userId || null,
        completed,
        created_at: createdAt,
        completed_at: completed ? completedAt : null,
        expiration: expiration || null,
    });

    return {
        // States
        isEditing,
        title,
        userId,
        completed,
        completedAt,
        expiration,
        createdAt,
        errors,
        
        // Setters
        setIsEditing,
        setTitle,
        setUserId,
        setCompleted,
        setCompletedAt,
        setExpiration,
        setCreatedAt,
        
        // Actions
        cancelEdit,
        validate,
        getFormData,
        resetEdit,
    };
}