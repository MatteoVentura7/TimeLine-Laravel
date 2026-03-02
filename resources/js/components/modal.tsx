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
    width = 'w-[440px]',
}: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm "
            onClick={onClose}
        >
            <div
                className={`relative rounded-2xl bg-white shadow-2xl dark:bg-neutral-800 m-auto ${width}
                max-h-[90vh] flex flex-col
                animate-in fade-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                {title && (
                    <div className="p-6 pb-3 flex items-center justify-between border-b dark:border-neutral-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {title}
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-700 cursor-pointer"
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}

                {/* CONTENT (scrollabile) */}
                <div className="px-6 py-4  overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden  flex-1">
                    {children}
                </div>

                {/* FOOTER */}
                {footer && (
                    <div className="p-6 pt-4 flex justify-end gap-2 border-t dark:border-neutral-700">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}