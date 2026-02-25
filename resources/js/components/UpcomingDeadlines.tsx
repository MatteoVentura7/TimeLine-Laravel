import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { Task } from '@/types/task-user';
import { AlertCircle, Calendar, Clock } from 'lucide-react';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';

interface UpcomingDeadlinesProps {
    tasks: Task[];
}

export default function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Filter tasks with expiration dates that are not completed
    const upcomingTasks = tasks
        .filter((task) => !task.completed && task.expiration_iso)
        .map((task) => ({
            ...task,
            daysUntil: Math.ceil(
                (new Date(task.expiration_iso!).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
            ),
        }))
        .sort((a, b) => a.daysUntil - b.daysUntil);

    // Pagination logic
    const totalPages = Math.ceil(upcomingTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = upcomingTasks.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getUrgencyBadge = (daysUntil: number) => {
        if (daysUntil < 0) {
            return (
                <Badge className="gap-1 border-0 bg-red-500 text-white hover:bg-red-600">
                    <AlertCircle className="h-3 w-3" />
                    Overdue
                </Badge>
            );
        }
        if (daysUntil === 0) {
            return (
                <Badge className="gap-1 border-0 bg-red-500 text-white hover:bg-red-600">
                    <Clock className="h-3 w-3" />
                    Due Today
                </Badge>
            );
        }
        if (daysUntil <= 3) {
            return (
                <Badge className="gap-1 border-0 bg-orange-500 text-white hover:bg-orange-600">
                    <Clock className="h-3 w-3" />
                    {daysUntil}d left
                </Badge>
            );
        }
        return (
            <Badge className="gap-1 border-0 bg-blue-500 text-white hover:bg-blue-600">
                <Calendar className="h-3 w-3" />
                {daysUntil}d left
            </Badge>
        );
    };

    if (upcomingTasks.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Upcoming Deadlines
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 rounded-full bg-green-100 p-3 dark:bg-green-900">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm font-medium">
                            No upcoming deadlines
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            You're all caught up! 🎉
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Upcoming Deadlines
                    </div>
                    <Badge variant="outline">{upcomingTasks.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                <div className="flex-1 space-y-3">
                    {currentTasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex items-start justify-between gap-3 rounded-lg border p-3 transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="line-clamp-1 text-sm font-medium">
                                        {task.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {task.expiration_formatted}
                                </div>
                                {task.user && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                            <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300">
                                                {task.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <span>{task.user.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getUrgencyBadge(task.daysUntil)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-4 border-t pt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPrevPage();
                                        }}
                                        className={
                                            currentPage === 1
                                                ? 'pointer-events-none opacity-50'
                                                : 'cursor-pointer'
                                        }
                                    />
                                </PaginationItem>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                            isActive={currentPage === page}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToNextPage();
                                        }}
                                        className={
                                            currentPage === totalPages
                                                ? 'pointer-events-none opacity-50'
                                                : 'cursor-pointer'
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
