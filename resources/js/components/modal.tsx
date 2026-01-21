import { ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    width?: string;
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    width = 'w-[420px]',
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className={`rounded-lg bg-white p-6 shadow-lg ${width}`}
            >
                {title && (
                    <h2 className="mb-4 text-xl font-semibold">
                        {title}
                    </h2>
                )}

                <div>{children}</div>

                {footer && (
                    <div className="mt-6 flex justify-end gap-2">
                        {footer}
                    </div>
                )}

                {!footer && (
                    <div className="mt-6 text-right">
                        <button
                            onClick={onClose}
                            className="rounded bg-gray-300 px-4 py-2"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
