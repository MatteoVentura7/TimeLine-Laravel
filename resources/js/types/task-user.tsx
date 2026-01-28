export interface User {
    id: number;
    name: string;
}

export interface SubTask {
    id: number;
    title: string;
    completed: boolean;
}

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    created_at_formatted: string;
    completed_at_formatted: string;
    expiration_formatted: string;
    created_at_iso: string;
    completed_at_iso: string | null;
    expiration_iso: string | null;
    user?: User | null;
    subtasks: SubTask[];
}

export interface TaskPagination {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
