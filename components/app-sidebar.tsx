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
  const [projects, setProjects] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showUnreadsOnly, setShowUnreadsOnly] = React.useState(false)
  const { open, setOpen } = useSidebar()

  // Fetch projects from dashboard API
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        // Transform the data to match sidebar expectations
        const transformedProjects = data.recentProjects.map((project: any) => ({
          id: project.id,
          title: project.title,
          procuringEntity: project.procuringEntity,
          budgetAbc: `₱${project.abc?.toLocaleString() || '0'}`,
          submissionDeadline: new Date(project.parsedClosingAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          status: 'open', // Default status for recent projects
          unread: Math.random() > 0.5 // Random unread status for demo
        }))
        setProjects(transformedProjects)
      } catch (error) {
        console.error('Error fetching projects for sidebar:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  // Check if we're on a specific project page (dashboard/client/projects/[id])
  const isOnProjectDetail = pathname.startsWith('/dashboard/client/projects/') && pathname !== '/dashboard/client/projects'
  // Check if we're on the projects list page
  const isOnProjectsList = pathname === '/dashboard/client/projects'
  // Extract project ID from pathname if on project detail page
  const activeProjectId = isOnProjectDetail ? pathname.split('/').pop() : null

  // Control sidebar collapsed state based on route - collapse on projects list page, open on project detail pages
  React.useEffect(() => {
    if (isOnProjectsList) {
      setOpen(false) // Collapse sidebar to icon-only on projects list
    } else if (isOnProjectDetail) {
      setOpen(true) // Open sidebar to show projects on project detail pages
    }
  }, [isOnProjectsList, isOnProjectDetail, setOpen])

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
      {open && (
        <Sidebar collapsible="none" className="flex-1 md:flex overflow-x-hidden">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-base font-medium">
                Projects
              </div>
              <Label className="flex items-center gap-2 text-sm">
                <span>Unreads</span>
                <Switch 
                  className="shadow-none" 
                  checked={showUnreadsOnly}
                  onCheckedChange={setShowUnreadsOnly}
                />
              </Label>
            </div>
            <SidebarInput placeholder="Search Projects" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
              {(showUnreadsOnly ? projects.filter(project => project.unread) : projects).map((project) => (
                <Link
                  href={`/dashboard/client/projects/${project.id}`}
                  key={project.title}
                  className={`flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 relative ${
                    activeProjectId === project.id.toString()
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium truncate flex-1 min-w-0">{project.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {project.unread && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          unread
                        </span>
                      )}
                      <span className="text-xs">{project.budgetAbc}</span>
                    </div>
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
