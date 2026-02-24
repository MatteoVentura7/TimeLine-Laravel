import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CheckCircle2, User, Calendar, Clock, CalendarCheck, Settings } from 'lucide-react';

export default function TaskTableHeader() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[80px]">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Status
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Title
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assigned To
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Start
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expiration
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        Completed On
                    </div>
                </TableHead>
                <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Settings className="h-4 w-4" />
                        Actions
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    );
}