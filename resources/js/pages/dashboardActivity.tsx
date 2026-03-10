import TableUser from '@/components/tableUser';
import TaskFormModal from '@/components/taskFormModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { dashboardActivity } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import type { TaskPagination, User } from '@/types/task-user';
import { router as Inertia } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Circle, Plus, Search, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: dashboardActivity().url,
    },
];

export default function DashboardActivity({
    tasks,
    statistc,
    users,
}: {
    tasks: TaskPagination;
    statistc: { todo: number; done: number };
    users: User[];
}) {
    const [search, setSearch] = useState('');
    const [searchMessage, setSearchMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [openTaskId, setOpenTaskId] = useState<number | null>(null);

    useEffect(() => {
        const storedSearch = localStorage.getItem('searchTerm');

        if (storedSearch) {
            setSearch(storedSearch);
            setSearchMessage(`Search results for: "${storedSearch}"`);
        }

        const params = new URLSearchParams(window.location.search);
        const fromTask = params.get('open_task');

        if (fromTask) {
            setOpenTaskId(Number(fromTask));
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (search) {
            localStorage.setItem('searchTerm', search);
            setSearchMessage(`Search results for: "${search}"`);
        } else {
            localStorage.removeItem('searchTerm');
            setSearchMessage(null);
        }

        Inertia.get(
            dashboardActivity().url,
            { search },
            { preserveState: true },
        );
    };

    const clearSearch = () => {
        setSearch('');
        localStorage.removeItem('searchTerm');
        setSearchMessage(null);

        Inertia.get(dashboardActivity().url, {}, { preserveState: true });
    };

    const total = statistc.todo + statistc.done;

    const completionRate =
        total > 0 ? Math.round((statistc.done / total) * 100) : 0;

    /* ---------- pagination helper ---------- */

    const getVisiblePages = () => {
        const pages: number[] = [];

        const total = tasks.last_page;
        const current = tasks.current_page;

        const maxPages = 4;

        let start = Math.max(1, current - 2);
        let end = Math.min(total, current + 2);

        if (current <= 3) {
            start = 1;
            end = Math.min(total, maxPages);
        }

        if (current >= total - 2) {
            start = Math.max(1, total - 4);
            end = total;
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const goToPage = (page: number) => {
        Inertia.get(
            dashboardActivity().url,
            { page, search },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />

            <div className="space-y-6 p-6">
                {/* Header */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Activity Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and track all your tasks
                        </p>
                    </div>

                    <Button
                        onClick={() => setOpen(true)}
                        disabled={isEditing}
                        size="lg"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                    </Button>
                </div>

                {/* Stats */}

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Activity
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                To Do
                            </CardTitle>
                            <Circle className="h-4 w-4 text-blue-500" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {statistc.todo}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {statistc.done}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completion Rate
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {completionRate}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>
                                Activity
                                <Badge className="ml-2" variant="outline">
                                    {tasks.total} total
                                </Badge>
                            </span>

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex gap-2"
                            >
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        placeholder="Search activity..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>

                                <Button type="submit">Search</Button>

                                {search && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearSearch}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </form>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <TableUser
                            tasks={tasks.data}
                            showEdit={true}
                            onEditChange={setIsEditing}
                            users={users}
                            openTaskId={openTaskId}
                            onTaskOpened={() => setOpenTaskId(null)}
                        />
                    </CardContent>

                    {/* PAGINATION */}

                    <CardFooter >
                        {tasks.last_page > 1 && (
                            <div className="flex w-full items-center justify-between">
                                <div className="text-sm text-muted-foreground text-nowrap ">
                                    Page {tasks.current_page} of{' '}
                                    {tasks.last_page}
                                </div>

                                <Pagination className='justify-end'>
                                    <PaginationContent>
                                        <PaginationItem >
                                            <Button   
                                        className='w-26'
                                        size="sm"  >
                                            <PaginationPrevious 
                                            className='hover:bg-transparent hover:text-white'
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                        tasks.current_page > 1
                                                    ) {
                                                        goToPage(
                                                            tasks.current_page -
                                                                1,
                                                        );
                                                    }
                                                }}
                                            />
                                            </Button>
                                        </PaginationItem>

                                        {tasks.last_page > 4 && tasks.current_page > 3 && (
                                            <>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            goToPage(1);
                                                        }}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>

                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            </>
                                        )}

                                        {getVisiblePages().map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={
                                                        page ===
                                                        tasks.current_page
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        goToPage(page);
                                                    }}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {tasks.last_page > 4 && tasks.current_page < tasks.last_page - 2 && (
                                            <>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>

                                                <PaginationItem>
                                                    
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            goToPage(
                                                                tasks.last_page,
                                                            );
                                                        }}
                                                    >
                                                        {tasks.last_page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </>
                                        )}

                                        <PaginationItem>
                                            <Button   
                                        size="sm"
                                        className='w-24'>
                                            <PaginationNext
                                            className='hover:bg-transparent hover:text-white'
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                        tasks.current_page <
                                                        tasks.last_page
                                                    ) {
                                                        goToPage(
                                                            tasks.current_page +
                                                                1,
                                                        );
                                                    }
                                                }}
                                            />
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardFooter>
                   
                </Card>
                

                <TaskFormModal
                    users={users}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </div>
        </AppLayout>
    );
}
