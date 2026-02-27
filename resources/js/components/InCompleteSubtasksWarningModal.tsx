import Modal from '@/components/modal';
import type { SubTask } from '@/types/task-user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { router } from '@inertiajs/core';
import { 
    CheckCircle2, 
    Circle, 
    AlertTriangle,
    CheckCheck,
    Loader2
} from 'lucide-react';

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
    const incompleteSubtasks = subtasks.filter(st => !st.completed);
    const [completedSubtasks, setCompletedSubtasks] = useState<Set<number>>(new Set());
    const [isCompletingAll, setIsCompletingAll] = useState(false);
    const [isCompletingSelected, setIsCompletingSelected] = useState(false);

    const toggleSubtask = (subtaskId: number) => {
        setCompletedSubtasks(prev => {
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
        
        // Complete all incomplete subtasks
        const promises = incompleteSubtasks.map(st =>
            new Promise((resolve) => {
                router.patch(
                    `/subtasks/${st.id}/toggle`,
                    {},
                    {
                        preserveScroll: true,
                        onFinish: () => resolve(true),
                    }
                );
            })
        );

        await Promise.all(promises);
        setIsCompletingAll(false);
        
        // Reload and confirm task completion
        router.reload({
            only: ['tasks'],
            onFinish: () => {
                onConfirm();
            }
        });
    };

    const handleCompleteSelected = async () => {
        if (completedSubtasks.size === 0) {
            onConfirm(); // No subtasks selected, just complete the task
            return;
        }

        setIsCompletingSelected(true);

        // Complete only selected subtasks
        const promises = Array.from(completedSubtasks).map(subtaskId =>
            new Promise((resolve) => {
                router.patch(
                    `/subtasks/${subtaskId}/toggle`,
                    {},
                    {
                        preserveScroll: true,
                        onFinish: () => resolve(true),
                    }
                );
            })
        );

        await Promise.all(promises);
        setIsCompletingSelected(false);

        // Reload and confirm task completion
        router.reload({
            only: ['tasks'],
            onFinish: () => {
                onConfirm();
            }
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title=""
            width="w-[600px]"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">Incomplete Subtasks</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            This task has <strong>{incompleteSubtasks.length} incomplete subtask{incompleteSubtasks.length !== 1 ? 's' : ''}</strong>. 
                            You can complete them now or mark the task as complete anyway.
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Subtasks List */}
                <div className="rounded-lg border bg-muted/50 p-4 max-h-[300px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold">
                            Incomplete Subtasks
                        </h4>
                        <Badge variant="secondary">
                            {completedSubtasks.size} / {incompleteSubtasks.length} selected
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        {incompleteSubtasks.map(st => (
                            <div
                                key={st.id}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors cursor-pointer"
                                onClick={() => toggleSubtask(st.id)}
                            >
                                <Checkbox
                                    checked={completedSubtasks.has(st.id)}
                                    onCheckedChange={() => toggleSubtask(st.id)}
                                    className="pointer-events-none"
                                />
                                <Circle className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1 text-sm">{st.title}</span>
                                {completedSubtasks.has(st.id) && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Box */}
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Click on subtasks to select which ones to complete, 
                    or use "Complete All" to mark all subtasks as done.
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
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