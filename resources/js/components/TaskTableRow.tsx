import type { Task } from '@/types/task-user';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    Circle, 
    Plus, 
    Info, 
    Trash2,
    User as UserIcon
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskTableRowModernProps {
    task: Task;
    onComplete: (task: Task) => void;
    onAddSubtask: (task: Task) => void;
    onOpenInfo: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

export default function TaskTableRow({
    task,
    onComplete,
    onAddSubtask,
    onOpenInfo,
    onDelete,
}: TaskTableRowModernProps) {
    return (
        <TableRow className="hover:bg-muted/50 transition-colors">
            {/* Status Checkbox */}
            <TableCell>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onComplete(task)}
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
                        </TooltipTrigger>
                        <TooltipContent>
                            {task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            {/* Title */}
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                    </span>
                    {task.subtasks && task.subtasks.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                        </Badge>
                    )}
                </div>
            </TableCell>

            {/* User */}
            <TableCell>
                {task.user ? (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                            <UserIcon className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{task.user.name}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </TableCell>

            {/* Start Date */}
            <TableCell className="text-sm text-muted-foreground">
                {task.created_at_formatted}
            </TableCell>

            {/* Expiration */}
            <TableCell className="text-sm">
                {task.expiration_formatted ? (
                    <Badge variant="outline" className="font-normal">
                        {task.expiration_formatted}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </TableCell>

            {/* Completed On */}
            <TableCell className="text-sm">
                {task.completed && task.completed_at_formatted ? (
                    <Badge variant="default" className="bg-green-500 font-normal hover:bg-green-600">
                        {task.completed_at_formatted}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onAddSubtask(task)}
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add subtask</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onOpenInfo(task)}
                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                >
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(task.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete task</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );
}