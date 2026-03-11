import Modal from '@/components/modal';
import ConfirmDeleteModal from '@/components/confirmDeleteModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    CheckCircle2, 
    Circle,
    Edit,
    Save,
    X,
    Trash2,
    Calendar,
    Clock,
    Link as LinkIcon
} from 'lucide-react';

interface SubtaskInfoModalProps {
    subtask: any;
    open: boolean;
    onClose: () => void;
}

export default function SubtaskInfoModal({ 
    subtask, 
    open, 
    onClose 
}: SubtaskInfoModalProps) {
    if (!subtask) return null;

    const isCompleted = subtask.completed;
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(subtask.title);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Update title when subtask prop changes
    useEffect(() => {
        if (subtask) {
            setTitle(subtask.title);
            setIsEditing(false); // Reset edit mode when subtask changes
        }
    }, [subtask]);

    const handleUpdate = () => {
        router.patch(
            `/subtasks/${subtask.id}`,
            { title },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditing(false);
                    router.reload({ only: ['tasks'] });
                },
            },
        );
    };

    const handleToggleComplete = () => {
        router.patch(
            `/subtasks/${subtask.id}/toggle`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['tasks'] });
                },
            },
        );
    };

    const handleDelete = () => {
        router.delete(`/subtasks/${subtask.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                router.reload({ only: ['tasks'] });
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                title=""
                width="w-[700px]"
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg ${
                                isCompleted 
                                    ? 'bg-green-100 dark:bg-green-900' 
                                    : 'bg-orange-100 dark:bg-orange-900'
                            }`}>
                                {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold">Dettagli Subtask</h2>
                                <Badge 
                                    variant={isCompleted ? "default" : "secondary"} 
                                    className={`mt-1 ${isCompleted ? 'bg-green-500' : ''}`}
                                >
                                    {isCompleted ? 'Completato' : 'In Corso'}
                                </Badge>
                            </div>
                        </div>
                        
                        <Button
                            onClick={handleToggleComplete}
                            variant="outline"
                            size="sm"
                            className={`gap-2 ${
                                isCompleted 
                                    ? 'border-green-200 hover:bg-green-50 dark:border-green-800' 
                                    : 'border-orange-200 hover:bg-orange-50 dark:border-orange-800'
                            }`}
                        >
                            {isCompleted ? (
                                <>
                                    <Circle className="h-4 w-4 text-orange-600" />
                                    <span>Segna Incompleto</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span>Segna Completato</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Parent Task */}
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Task Principale</p>
                            <p className="text-sm font-medium">{subtask.task?.title || 'N/A'}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Subtask Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Titolo Subtask
                        </label>
                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-lg"
                                placeholder="Inserisci titolo subtask"
                            />
                        ) : (
                            <p className="text-lg font-medium">{subtask.title}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={handleUpdate}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Salva Modifiche
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setTitle(subtask.title);
                                    }}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Annulla
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Modifica
                                </Button>
                                <Button
                                    onClick={() => setConfirmOpen(true)}
                                    variant="destructive"
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Elimina
                                </Button>
                            </>
                        )}
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Creato
                                </p>
                                <p className="text-sm mt-1">
                                    {formatDate(subtask.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Aggiornato
                                </p>
                                <p className="text-sm mt-1">
                                    {formatDate(subtask.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Elimina Subtask"
                message={`Sei sicuro di voler eliminare il subtask "${subtask.title}"? Questa azione non può essere annullata.`}
            />
        </>
    );
}