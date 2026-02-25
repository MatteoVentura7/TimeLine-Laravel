import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task-user';
import { useEffect, useState } from 'react';

import { CheckCircle2, Circle } from 'lucide-react';

export default function ListItem({
    tasks = [],
    onTaskClick,
}: {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    showEdit?: boolean;
    onEditChange?: (value: boolean) => void;
}) {
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    useEffect(() => {
        setLocalTasks(tasks); // aggiorna se il prop cambia
    }, [tasks]);

    return (
        <div className="flex h-full flex-col">
            {localTasks.length === 0 ? (
                <div className="animate-fadeInUp mt-6 flex flex-col items-center justify-center">
                    <img src="9264828.jpg" className="max-w-36 opacity-90" />
                    <p className="mt-4 text-xl text-gray-500">
                        No activity found 🎉
                    </p>
                </div>
            ) : (

                <ul className="m-4 max-h-220 grow space-y-3 p-0 pr-2 pb-2">
                    {localTasks.map((task) => {
                     
                        return (
                            <li
                                key={task.id}
                                onClick={() => onTaskClick?.(task)}
                                className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow transition-all hover:scale-[1.02] hover:shadow-lg dark:bg-neutral-800"
                            >
                                <div className="flex items-center space-x-3">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 transition-all dark:text-gray-100">
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            className={`h-8 w-8 p-0 ${
                                                task.completed
                                                    ? 'text-green-600 hover:text-green-700'
                                                    : 'text-gray-400 hover:text-green-600'
                                            }`}
                                        >
                                            {task.completed ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <Circle className="h-5 w-5" />
                                            )}
                                        </Button>
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
