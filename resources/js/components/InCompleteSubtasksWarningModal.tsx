import Modal from '@/components/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { SubTask } from '@/types/task-user';
import { router } from '@inertiajs/core';
import {
    AlertTriangle,
    CheckCheck,
    CheckCircle2,
    Circle,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';

interface IncompleteSubtasksWarningModalProps {
    open: boolean;
    subtasks: SubTask[];
    onClose: () => void;
    onConfirm: () => void;
}

export default function IncompleteSubtasksWarningModal({
    open,
    subtasks,
    onClose,
    onConfirm,
}: IncompleteSubtasksWarningModalProps) {
    const incompleteSubtasks = subtasks.filter((st) => !st.completed);
    const [completedSubtasks, setCompletedSubtasks] = useState<Set<number>>(
        new Set(),
    );
    const [isCompletingAll, setIsCompletingAll] = useState(false);
    const [isCompletingSelected, setIsCompletingSelected] = useState(false);

    const toggleSubtask = (subtaskId: number) => {
        setCompletedSubtasks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(subtaskId)) {
                newSet.delete(subtaskId);
            } else {
                newSet.add(subtaskId);
            }
            return newSet;
        });
    };

    const handleCompleteAll = async () => {
        setIsCompletingAll(true);

        const promises = incompleteSubtasks.map(
            (st) =>
                new Promise((resolve) => {
                    router.patch(
                        `/subtasks/${st.id}/toggle`,
                        {},
                        {
                            preserveScroll: true,
                            onFinish: () => resolve(true),
                        },
                    );
                }),
        );

        await Promise.all(promises);
        setIsCompletingAll(false);

        router.reload({
            only: ['tasks'],
            onFinish: () => {
                onConfirm();
            },
        });
    };

    const handleCompleteSelected = async () => {
        if (completedSubtasks.size === 0) {
            onConfirm();
            return;
        }

        setIsCompletingSelected(true);

        const promises = Array.from(completedSubtasks).map(
            (subtaskId) =>
                new Promise((resolve) => {
                    router.patch(
                        `/subtasks/${subtaskId}/toggle`,
                        {},
                        {
                            preserveScroll: true,
                            onFinish: () => resolve(true),
                        },
                    );
                }),
        );

        await Promise.all(promises);
        setIsCompletingSelected(false);

        router.reload({
            only: ['tasks'],
            onFinish: () => {
                onConfirm();
            },
        });
    };

    return (
        <Modal open={open} onClose={onClose} title="" width="w-[600px]">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                            Incomplete Subtasks
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            This task has{' '}
                            <strong>
                                {incompleteSubtasks.length} incomplete subtask
                                {incompleteSubtasks.length !== 1 ? 's' : ''}
                            </strong>
                            . You can complete them now or mark the task as
                            complete anyway.
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Subtasks List */}
                <div className="max-h-75 overflow-y-auto rounded-lg border bg-muted/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                            Incomplete Subtasks
                        </h4>
                        <Badge variant="secondary">
                            {completedSubtasks.size} /{' '}
                            {incompleteSubtasks.length} selected
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        {incompleteSubtasks.map((st) => (
                            <div
                                key={st.id}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/50"
                                onClick={() => toggleSubtask(st.id)}
                            >
                                <Checkbox
                                    checked={completedSubtasks.has(st.id)}
                                    onCheckedChange={() => toggleSubtask(st.id)}
                                    className="pointer-events-none"
                                />
                                <Circle  className="h-4 w-4 text-muted-foreground pointer-events-none" />
                                <span className="flex-1 text-sm">
                                    {st.title}
                                </span>
                                {completedSubtasks.has(st.id) && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                        disabled={isCompletingAll || isCompletingSelected}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCompleteSelected}
                        variant="secondary"
                        className="flex-1 gap-2"
                        disabled={isCompletingAll || isCompletingSelected}
                    >
                        {isCompletingSelected ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Completing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                {completedSubtasks.size > 0
                                    ? `Complete Selected (${completedSubtasks.size})`
                                    : 'Skip & Complete Task'}
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleCompleteAll}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                        disabled={isCompletingAll || isCompletingSelected}
                    >
                        {isCompletingAll ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Completing All...
                            </>
                        ) : (
                            <>
                                <CheckCheck className="h-4 w-4" />
                                Complete All
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
