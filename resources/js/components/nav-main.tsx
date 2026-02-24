import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {  dashboardActivity } from '@/routes';
import { BookOpen, Wrench } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <>
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                                  
                        </SidebarMenuButton>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            
                                
                                 <Link
                                    href={dashboardActivity()}
                                    className="inline-block rounded-sm border border-transparent  text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] mt-3 "
                                >
                                    <i className="fa-solid fa-list-check"></i>
                                    <span className='ml-2'>Activity</span>
                                </Link> 
                                
                            
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="px-2 py-0 mt-4">
            <SidebarGroupLabel>Documentation</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={page.url.startsWith('/docs/user-guide')}
                        tooltip={{ children: 'User Guide' }}
                    >
                        <Link href="/docs/user-guide">
                            <BookOpen className="h-4 w-4" />
                            <span>User Guide</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={page.url.startsWith('/docs/technical')}
                        tooltip={{ children: 'Technical Docs' }}
                    >
                        <Link href="/docs/technical">
                            <Wrench className="h-4 w-4" />
                            <span>Technical Docs</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        </>
    );
}