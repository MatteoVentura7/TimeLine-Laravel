import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';

import { BookOpen, Folder, LayoutGrid , Wrench } from 'lucide-react';
import AppLogo from './app-logo';
import { technical, userGuide } from '@/routes/docs';

import { resolveUrl } from '@/lib/utils';

import { Link, usePage } from '@inertiajs/react';
import {  dashboardActivity } from '@/routes';


const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
       {
        title: 'User guide',
        href: userGuide(),
         icon: BookOpen
        
    },

    {
        title: 'Technical Docs',
        href: technical(),
       icon: Wrench
    
    },
 
];

export function AppSidebar() {
     const page = usePage();
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
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
             
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
