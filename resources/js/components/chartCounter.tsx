import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Activity, CheckCircle2, Circle, TrendingUp } from 'lucide-react';

export default function ChartCounter({
    statistc,
}: {
    statistc: { todo: number; done: number };
}) {
    const total = statistc.todo + statistc.done;
    const completionRate =
        total > 0 ? Math.round((statistc.done / total) * 100) : 0;

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
            <CardHeader className='border-b pb-3 dark:border-neutral-700 w-full' >
            <CardTitle className="flex justify-center items-center gap-2 whitespace-nowrap ">
                <Activity className="h-5 w-5" />
                Statistics Overview
            </CardTitle>
            <CardDescription className=' whitespace-nowrap text-center [@media(min-width:1024px)_and_(max-width:1200px)]:whitespace-normal [@media(max-width:1023px)]:whitespace-nowrap' >
                Visual representation of your task progress
            </CardDescription>
            </CardHeader>
           
                <Card className='w-full h-32'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-linear-to-r from-blue-500 to-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completionRate}%</div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

            {/* Stats Cards */}
            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                <Card className="h-22 border-l-4 border-l-blue-500 pt-3">
                    <CardContent className="pl-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Circle className="h-4 w-4" />
                            <span className="text-sm font-medium whitespace-nowrap">To Do</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {statistc.todo ?? 0}
                        </p>
                    </CardContent>
                </Card>

                <Card className="h-22  border-l-4 border-l-emerald-500 pt-3">
                    <CardContent className="pl-4 ">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Done</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {statistc.done ?? 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Total Badge */}
            <Badge variant="outline" className="text-sm">
                Total: {total} tasks
            </Badge>
        </div>
    );
}
