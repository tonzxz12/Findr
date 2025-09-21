import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Search, Plus, Mail, Phone, Edit, Trash2, Shield, Calendar, Activity } from "lucide-react"

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@company.com",
    role: "admin",
    department: "Management",
    phone: "+63 917 123 4567",
    joinDate: "2024-01-15",
    lastActive: "2024-11-10T11:30:00Z",
    status: "active",
    avatar: "/avatars/maria.jpg",
    projectsCount: 12,
    documentsGenerated: 45,
  },
  {
    id: 2,
    name: "John Dela Cruz",
    email: "john.delacruz@company.com",
    role: "user",
    department: "Business Development",
    phone: "+63 917 234 5678",
    joinDate: "2024-02-20",
    lastActive: "2024-11-10T10:15:00Z",
    status: "active",
    avatar: "/avatars/john.jpg",
    projectsCount: 8,
    documentsGenerated: 23,
  },
  {
    id: 3,
    name: "Ana Reyes",
    email: "ana.reyes@company.com",
    role: "user",
    department: "Technical Writing",
    phone: "+63 917 345 6789",
    joinDate: "2024-03-10",
    lastActive: "2024-11-09T16:45:00Z",
    status: "active",
    avatar: "/avatars/ana.jpg",
    projectsCount: 15,
    documentsGenerated: 67,
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@company.com",
    role: "viewer",
    department: "Quality Assurance",
    phone: "+63 917 456 7890",
    joinDate: "2024-04-05",
    lastActive: "2024-11-08T14:20:00Z",
    status: "inactive",
    avatar: "/avatars/carlos.jpg",
    projectsCount: 5,
    documentsGenerated: 12,
  },
  {
    id: 5,
    name: "Lisa Tan",
    email: "lisa.tan@company.com",
    role: "user",
    department: "Finance",
    phone: "+63 917 567 8901",
    joinDate: "2024-05-12",
    lastActive: "2024-11-10T09:30:00Z",
    status: "active",
    avatar: "/avatars/lisa.jpg",
    projectsCount: 6,
    documentsGenerated: 18,
  },
];

const rolePermissions = {
  admin: {
    label: "Administrator",
    color: "bg-red-100 text-red-800",
    permissions: ["Full access", "User management", "System settings", "All projects"],
  },
  user: {
    label: "User",
    color: "bg-blue-100 text-blue-800",
    permissions: ["Create projects", "Generate documents", "View team", "Edit own profile"],
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-800",
    permissions: ["View projects", "View documents", "View team", "Limited access"],
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

export default function TeamPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/client/dashboard">QFindr</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Team</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
              <p className="text-muted-foreground">
                Manage team members, roles, and permissions
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">Across all departments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.filter(member => member.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.filter(member => member.role === 'admin').length}
                </div>
                <p className="text-xs text-muted-foreground">With full access</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Projects</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(teamMembers.reduce((acc, member) => acc + member.projectsCount, 0) / teamMembers.length)}
                </div>
                <p className="text-xs text-muted-foreground">Per team member</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or department..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="role">Role</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="user">User</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="w-48">
                  <Label htmlFor="status">Status</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.department}</p>
                    <Badge className={rolePermissions[member.role as keyof typeof rolePermissions].color}>
                      {rolePermissions[member.role as keyof typeof rolePermissions].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{member.projectsCount}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{member.documentsGenerated}</div>
                        <div className="text-xs text-muted-foreground">Documents</div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <div>Joined: {new Date(member.joinDate).toLocaleDateString()}</div>
                      <div>Last active: {new Date(member.lastActive).toLocaleDateString()}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Overview of permissions for each role in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(rolePermissions).map(([role, config]) => (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{config.label}</h4>
                      <Badge className={config.color}>
                        {teamMembers.filter(member => member.role === role).length} members
                      </Badge>
                    </div>
                    <ul className="space-y-1">
                      {config.permissions.map((permission, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
