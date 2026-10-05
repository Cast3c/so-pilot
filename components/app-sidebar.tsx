"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    CalendarDays,
    LayoutDashboard,
    Plug,
    SquarePen,
    Zap,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    { title: "Posts", href: "/dashboard", icon: LayoutDashboard },
    { title: "Compose", href: "/compose", icon: SquarePen },
    { title: "Calendar", href: "/calendar", icon: CalendarDays },
    { title: "Accounts", href: "/accounts", icon: Plug },
    { title: "Automations", href: "/automations", icon: Zap },
];

export function AppSidebar() {
    const pathname = usePathname();

    return(
        <Sidebar>
            <SidebarHeader className="px-4 py-3 text-lg font-black">
                So-Pilot
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                    isActive={pathname.startsWith(item.href)}
                                    render={<Link href={item.href}/>}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="px-4 py-3">
                <UserButton />
            </SidebarFooter>
        </Sidebar>
    )
}