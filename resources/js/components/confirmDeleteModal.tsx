interface ConfirmDeleteModalProps {
    open: boolean;
    loading?: boolean;
    title?: string;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmDeleteModal({
    open,
    loading = false,
    title = 'Confirm delete',
    message = 'Are you sure you want to delete this item?',
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl dark:bg-neutral-900">
                <h2 className="mb-4 text-xl font-semibold">{title}</h2>

                <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                    {message}
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
