import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';
import { Calendar, Home, Inbox, Search } from 'lucide-react';
import Link from 'next/link';

function LinkAccess(userRole, item, userId) {
  if (item.access === 'All' || userRole == item.access) {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <Link href={`/users/${userId}/${item.url}`}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
}

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
    access: 'All',
  },
  {
    title: 'Home',
    url: '/home',
    icon: Home,
    access: 'All',
  },
  {
    title: 'Inbox',
    url: '/home/mail',
    icon: Inbox,
    access: 'All',
  },
  {
    title: 'Reservations',
    url: '/home/admin/reservations',
    icon: Calendar,
    access: 'Admin',
  },
  {
    title: 'User Access',
    url: '/home/admin/users',
    icon: Search,
    access: 'Admin',
  },
];

export async function AppSidebar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => LinkAccess('Admin', item, user.id))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
