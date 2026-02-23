import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

export default function ChartCounter({
    statistc,
}: {
    statistc: { todo: number; done: number };
}) {
    const total = statistc.todo + statistc.done;
    const completionRate = total > 0 ? Math.round((statistc.done / total) * 100) : 0;

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
          
            <Card className="w-full max-w-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Completion Rate
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center">
                        <div className="relative h-20 w-20">
                            <svg
                                className="h-full w-full -rotate-90 transform"
                                viewBox="0 0 100 100"
                            >
                                
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-muted"
                                />
                              
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={`${completionRate * 2.827} 283`}
                                    strokeLinecap="round"
                                    className="text-emerald-500 transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold">
                                    {completionRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                <Card className="border-l-4 border-l-blue-500 h-25">
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Circle className="h-4 w-4" />
                            <span className="text-sm font-medium">To Do</span>
                        </div>
                        <p className="mt-2  text-3xl font-bold text-blue-600">
                            {statistc.todo ?? 0}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 h-25">
                    <CardContent className="p-4 pt-0">
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