import Modal from '@/components/modal';
interface ConfirmDeleteModalProps {
    open: boolean;
    loading?: boolean;
    title?: string;
    message?: string;

    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmDeleteModal({
    open,
    loading = false,
    title = 'Confirm delete',
    message = 'Are you sure you want to delete this item?',
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!open) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            width="w-80"
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Confirm'}
                    </button>
                </>
            }
        >
            <p className="mb-6 text-neutral-700 dark:text-neutral-300 text-lg">
                {message}
            </p>
        </Modal>
    );
}
