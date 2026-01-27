import Modal from './modal';
import TaskForm from './taskForm';
import type { User } from '@/types/task-user'



interface TaskFormModalProps {
    users: User[];
    open: boolean;
    onClose: () => void;
}

export default function TaskFormModal({
    users,
    open,
    onClose,
}: TaskFormModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="New activity"
            width="w-[480px]"
        >
            <TaskForm users={users} onSuccess={onClose} />
        </Modal>
    );
}
