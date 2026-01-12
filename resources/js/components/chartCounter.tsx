export default function ChartCounter({
    statistc,
}: {
    statistc: { todo: number; done: number };
}) {
    return (
        <div>
           

            <div className="flex justify-center gap-4 mt-5">
                <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                    <span className="font-semibold">To Do</span>
                    <h1 className="mt-3 text-4xl font-bold text-blue-600">
                        {statistc.todo ?? 0}
                    </h1>
                </div>

                <div className="rounded-lg bg-white p-4 text-center text-lg shadow dark:bg-neutral-800">
                    <span className="font-semibold">Done</span>
                    <h1 className="mt-3 text-4xl font-bold text-green-600">
                        {statistc.done ?? 0}
                    </h1>
                </div>
            </div>
        </div>
    );
}
