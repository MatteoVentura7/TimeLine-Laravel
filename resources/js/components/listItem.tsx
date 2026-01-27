import type { Task } from '@/types/task-user';

export default function ListItem({
    tasks = [],
}: {
    tasks: Task[];
    showEdit?: boolean;
    onEditChange?: (value: boolean) => void;
}) {
    return (
        <div className="flex h-full flex-col">
            {tasks.length === 0 ? (
                <div className="animate-fadeInUp mt-6 flex flex-col items-center justify-center">
                    <img src="9264828.jpg" className="max-w-36 opacity-90" />
                    <p className="mt-4 text-xl text-gray-500">
                        No activity found 🎉
                    </p>
                </div>
            ) : (
                <ul className="m-4 max-h-220 grow space-y-3 p-0 pr-2 pb-2">
                    {tasks.map((task) => {
                        return (
                            <li
                                key={task.id}
                                className="flex items-center justify-between rounded-xl bg-white p-4 shadow hover:shadow-lg dark:bg-neutral-800"
                            >
                                <div className="flex items-center space-x-3">
                                    {/* <span className="font-medium transition-colors duration-200">
                                            <span className="block max-w-[23ch] overflow-hidden font-medium text-ellipsis whitespace-nowrap sm:max-w-[40ch] md:max-w-[30ch] lg:max-w-[12ch] xl:max-w-[20ch] 2xl:max-w-[25ch]">
                                                {task.title}
                                            </span>
                                        </span> */}
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                                        <i className="fa-solid fa-list-check text-blue-500"></i>
                                        {task.title}
                                    </h3>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
