import Modal from '@/components/modal';
import type { Task } from '@/types/task-user';

interface CompleteTaskModalProps {
    open: boolean;
    task: Task | null;
    completedAt: string;
    loading?: boolean;
    onChangeCompletedAt: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CompleteTaskModal({
    open,
    task,
    completedAt,
    loading = false,
    onChangeCompletedAt,
    onClose,
    onConfirm,
}: CompleteTaskModalProps) {
    if (!task) return null;

    const isoToLocalDatetime = (iso: string) => {
        const d = new Date(iso);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60_000);
        return local.toISOString().slice(0, 16);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Complete task"
            width="w-80"
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded bg-gray-300 px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading || !completedAt}
                        className="rounded bg-green-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Confirm
                    </button>
                </>
            }
        >
            <input
                type="datetime-local"
                value={completedAt || ''}
                required
                min={isoToLocalDatetime(task.created_at_iso)}
                onChange={(e) => onChangeCompletedAt(e.target.value)}
                className="w-full rounded border p-2"
            />
        </Modal>
    );
}
