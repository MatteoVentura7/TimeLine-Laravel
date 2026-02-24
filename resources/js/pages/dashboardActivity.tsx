import TableUser from '@/components/tableUser';
import AppLayout from '@/layouts/app-layout';
import { dashboardActivity } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { router as Inertia } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import TaskFormModal from '@/components/taskFormModal';
import type { TaskPagination, User } from '@/types/task-user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, CheckCircle2, Circle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const completionRate = total > 0 ? Math.round((statistc.done / total) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />

            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Activity Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage and track all your tasks in one place
                        </p>
                    </div>
                    <Button 
                        onClick={() => setOpen(true)} 
                        disabled={isEditing}
                        size="lg"
                        className="w-full md:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                            <p className="text-xs text-muted-foreground">
                                All active tasks
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">To Do</CardTitle>
                            <Circle className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{statistc.todo ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Pending tasks
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistc.done ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Finished tasks
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completionRate}%</div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search tasks by title..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    disabled={isEditing}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" disabled={isEditing}>
                                Search
                            </Button>
                            {search && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={clearSearch}
                                    disabled={isEditing}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                        {searchMessage && (
                            <div className="mt-3 flex items-center gap-2">
                                <Badge variant="secondary">
                                    <Search className="mr-1 h-3 w-3" />
                                    {searchMessage}
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearSearch}
                                    className="h-6 px-2"
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Task Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span>Tasks</span>
                            <Badge variant="outline">{tasks.total} total</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <TableUser
                            tasks={tasks.data}
                            showEdit={true}
                            onEditChange={setIsEditing}
                            users={users}
                            openTaskId={openTaskId}
                            onTaskOpened={() => setOpenTaskId(null)}
                        />
                    </CardContent>
                </Card>

                {/* Pagination */}
                {tasks.last_page > 1 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing page {tasks.current_page} of {tasks.last_page}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const prevLink = tasks.links.find(l => l.label.includes('Previous'));
                                            if (prevLink?.url && !isEditing) {
                                                Inertia.get(prevLink.url);
                                            }
                                        }}
                                        disabled={!tasks.links.find(l => l.label.includes('Previous'))?.url || isEditing}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>

                                    {tasks.links
                                        .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url && !isEditing) {
                                                        Inertia.get(link.url);
                                                    }
                                                }}
                                                disabled={!link.url || isEditing}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const nextLink = tasks.links.find(l => l.label.includes('Next'));
                                            if (nextLink?.url && !isEditing) {
                                                Inertia.get(nextLink.url);
                                            }
                                        }}
                                        disabled={!tasks.links.find(l => l.label.includes('Next'))?.url || isEditing}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Create Task Modal */}
                <TaskFormModal
                    users={users}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </div>
        </AppLayout>
    );
}