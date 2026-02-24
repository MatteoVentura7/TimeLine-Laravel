export default function TaskTableHeader() {
    return (
        <thead>
            <tr className="border-b dark:border-neutral-700">
                <th className="p-3 text-left">Done</th>
                <th className="p-3 text-left">
                    <i className="fa-solid fa-list-ul pr-2"></i>
                    Title
                </th>
                <th className="p-3 text-left">
                    <i className="fa-solid fa-user pr-2"></i>
                    To Assigned
                </th>
                <th className="p-3 text-left">
                    <i className="fa-solid fa-hourglass-start pr-2"></i>
                    Start
                </th>
                <th className="p-3 text-left">
                    <i className="fa-solid fa-hourglass-end pr-2"></i>
                    Expire
                </th>
                <th className="p-3 text-left">
                    <i className="fa-solid fa-check pr-2"></i>
                    Completed On
                </th>
                <th className="p-3 text-right">Actions</th>
            </tr>
        </thead>
    );
}
