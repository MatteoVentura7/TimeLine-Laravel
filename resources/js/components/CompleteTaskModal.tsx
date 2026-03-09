import Modal from '@/components/modal';
import type { Task } from '@/types/task-user';
import DateTimePicker from '@/components/ui/date-time-picker';

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
                        className="rounded bg-gray-300 px-4 py-2 transition hover:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading || !completedAt}
                        className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Saving...' : 'Confirm'}
                    </button>
                </>
            }
        >
            <div className="space-y-3">

                <DateTimePicker
                    value={completedAt}
                    onChange={onChangeCompletedAt}
                    minDate={task.created_at_iso}
                    placeholder="Select completion date"
                />
            </div>
        </Modal>
    );
}