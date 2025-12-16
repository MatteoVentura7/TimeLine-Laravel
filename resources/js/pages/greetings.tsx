
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: dashboard().url,
    },
];
export default function Greetings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity" />
              <div className="  relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                        
                                            <h1>Welcome</h1>
                                        </div>
                
        </AppLayout>
    )
}

