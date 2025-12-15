export default function ChartCounter({
    
    statistc = [],
}: {

    statistc: number[];
})
{     return (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <h1 className="mt-5 mb-4 text-center text-3xl font-bold text-blue-500">
                Your progress chart
            </h1>

            <div className="flex justify-center gap-4">
                <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                    <span className="font-semibold">To Do</span>
                    <h1 className="mt-3 text-4xl font-bold text-blue-600">
                        {statistc[0] ?? 0}
                    </h1>
                </div>

                <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                    <span className="font-semibold">Done</span>
                    <h1 className="mt-3 text-4xl font-bold text-green-600">
                        {statistc[1] ?? 0}
                    </h1>
                </div>
            </div>
        </div>
    );
}
