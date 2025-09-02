"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Building2, FileText, Zap, Users, Settings, BarChart3, Search, Archive, Workflow } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { ModeToggle } from "@/components/mode-toggle"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

// QFindr application data
const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Building2,
      isActive: false,
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
      isActive: false,
    },
    {
      title: "AI Generation",
      url: "/ai-generation",
      icon: Zap,
      isActive: false,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
      isActive: false,
    },
    {
      title: "Team",
      url: "/team",
      icon: Users,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: false,
    },
  ],
  recentProjects: [
    {
      id: "1",
      name: "Office Equipment Supply",
      agency: "DOH Central Office",
      budget: "₱2.5M",
      deadline: "Dec 15, 2024",
      status: "active",
    },
    {
      id: "2",
      name: "IT Infrastructure Modernization", 
      agency: "DOST Regional Office",
      budget: "₱15.8M",
      deadline: "Jan 20, 2025",
      status: "pending",
    },
    {
      id: "3",
      name: "Construction Materials Supply",
      agency: "DPWH Region IV-A",
      budget: "₱8.2M", 
      deadline: "Nov 30, 2024",
      status: "draft",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const [projects, setProjects] = React.useState(data.recentProjects)
  const { setOpen } = useSidebar()

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image 
                      src="/quanby.png" 
                      alt="QFindr Logo" 
                      width={16} 
                      height={16} 
                      className="size-4"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">QFindr</span>
                    <span className="truncate text-xs">Professional</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => handleNavigation(item.url)}
                      isActive={pathname === item.url}
                      className="px-2.5 md:px-2"
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
        <SidebarFooter className="gap-2">
          <div className="flex justify-center">
            <ModeToggle />
          </div>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {data.navMain.find(item => item.url === pathname)?.title || "Dashboard"}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {projects.map((project) => (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.name}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium">{project.name}</span>{" "}
                    <span className="ml-auto text-xs">{project.budget}</span>
                  </div>
                  <span className="text-muted-foreground">{project.agency}</span>
                  <span className="line-clamp-2 w-[260px] text-xs">
                    Deadline: {project.deadline} • Status: {project.status}
                  </span>
                </Link>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
