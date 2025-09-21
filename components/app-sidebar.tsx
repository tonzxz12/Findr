"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Building2, Calendar, User, Archive, Workflow, LayoutDashboard } from "lucide-react"

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
import { getAllProjects } from "@/data/projects"

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
      url: "/dashboard/client",
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: "Projects",
      url: "/dashboard/client/projects",
      icon: Building2,
      isActive: false,
    },
    {
      title: "Calendar",
      url: "/dashboard/client/calendar",
      icon: Calendar,
      isActive: false,
    },
    {
      title: "Profile",
      url: "/dashboard/client/profile",
      icon: User,
      isActive: false,
    },
    {
      title: "Repository",
      url: "/dashboard/client/repository",
      icon: Archive,
      isActive: false,
    },
    {
      title: "Workflows",
      url: "/dashboard/client/workflows",
      icon: Workflow,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const [projects, setProjects] = React.useState(getAllProjects())
  const { setOpen } = useSidebar()

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  // Check if we're on a specific project page (projects/[id])
  const isOnProjectDetail = pathname.startsWith('/dashboard/client/projects/') && pathname !== '/dashboard/client/projects'
  // Check if we're on the projects list page
  const isOnProjectsList = pathname === '/dashboard/client/projects'
  // Extract project ID from pathname if on project detail page
  const activeProjectId = isOnProjectDetail ? pathname.split('/').pop() : null

  // Control sidebar collapsed state based on route
  React.useEffect(() => {
    if (isOnProjectsList) {
      setOpen(false) // Collapse sidebar to icon-only on projects list
    } else {
      setOpen(true) // Expand sidebar on other pages
    }
  }, [isOnProjectsList, setOpen])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-x-hidden *:data-[sidebar=sidebar]:flex-row"
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
      {/* Show when sidebar is expanded */}
      {!isOnProjectsList && (
        <Sidebar collapsible="none" className="flex-1 md:flex overflow-x-hidden">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-base font-medium">
                Projects
              </div>
              <Label className="flex items-center gap-2 text-sm">
                <span>Unreads</span>
                <Switch className="shadow-none" />
              </Label>
            </div>
            <SidebarInput placeholder="Search Projects" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                {projects.map((project) => (
                  <Link
                    href={`/dashboard/client/projects/${project.id}`}
                    key={project.title}
                    className={`flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 ${
                      activeProjectId === project.id.toString()
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="font-medium truncate flex-1 min-w-0">{project.title}</span>{" "}
                      <span className="ml-auto text-xs shrink-0">{project.budgetAbc}</span>
                    </div>
                    <span className="text-muted-foreground">{project.procuringEntity}</span>
                    <span className="line-clamp-2 w-[260px] text-xs">
                      Deadline: {project.submissionDeadline} • Status: {project.status}
                    </span>
                  </Link>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  )
}
