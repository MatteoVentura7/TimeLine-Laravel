export interface User {
    id: number;
    name: string;
}

export interface SubTask {
    id: number;
    title: string;
    completed: boolean;
    task?: {
        id: number;
        title: string;
    };
    created_at: string;
    updated_at: string;
}

export interface TaskFile {
    id: number;
    original_name: string;
    mime_type: string | null;
    size: number | null;
    url: string;
    created_at: string;
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
    files: TaskFile[];
}

export interface TaskPagination {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
