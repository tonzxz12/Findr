import Link from "next/link"
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
import { Building2, Search, Plus, Calendar, DollarSign, Eye, Edit, Trash2 } from "lucide-react"

// Mock data for projects - based on your actual schema
const projects = [
  {
    id: 1,
    projectId: "25-08-912",
    refId: "REF-2024-001",
    title: "Supply and Delivery of Office Equipment",
    url: "https://philgeps.gov.ph/project/25-08-912",
    procuringEntity: "Department of Health - Central Office",
    areaOfDelivery: "Metro Manila",
    procurementSummary: "Supply and delivery of office equipment including computers, printers, and furniture.",
    keyRequirements: "Must have valid DTI registration, Mayor's permit, Tax clearance certificate.",
    budgetAbc: "₱2,500,000.00",
    deadline: "2024-12-15",
    aiConfidenceScore: 85,
    processingMethod: "gpt-4o-mini",
    status: "completed",
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-11-15T14:30:00Z",
  },
  {
    id: 2,
    projectId: "25-09-156",
    refId: "REF-2024-002", 
    title: "IT Infrastructure Modernization Project",
    url: "https://philgeps.gov.ph/project/25-09-156",
    procuringEntity: "Department of Science and Technology - Regional Office",
    areaOfDelivery: "Metro Manila",
    procurementSummary: "Upgrade and modernization of IT infrastructure including servers and networking equipment.",
    keyRequirements: "ICT certification, ISO 27001 certification, PCAB registration required.",
    budgetAbc: "₱15,800,000.00", 
    deadline: "2025-01-20",
    aiConfidenceScore: 92,
    processingMethod: "gpt-4o",
    status: "processing",
    createdAt: "2024-11-10T09:15:00Z",
    updatedAt: "2024-11-20T16:45:00Z",
  },
  {
    id: 3,
    projectId: "25-10-234",
    refId: "REF-2024-003",
    title: "Construction Materials Supply",
    url: "https://philgeps.gov.ph/project/25-10-234", 
    procuringEntity: "Department of Public Works and Highways - Region IV-A",
    areaOfDelivery: "Laguna, Philippines",
    procurementSummary: "Supply of construction materials including cement, steel bars, and aggregates.",
    keyRequirements: "Valid business permits, tax clearance, and material quality certifications required.",
    budgetAbc: "₱8,200,000.00",
    deadline: "2024-11-30",
    aiConfidenceScore: 78,
    processingMethod: "gpt-4o-mini", 
    status: "pending",
    createdAt: "2024-10-20T10:00:00Z",
    updatedAt: "2024-11-01T12:20:00Z",
  },
  {
    id: 4,
    projectId: "25-11-445",
    refId: "REF-2024-004",
    title: "Medical Equipment Procurement",
    url: "https://philgeps.gov.ph/project/25-11-445",
    procuringEntity: "Philippine General Hospital",
    areaOfDelivery: "Manila",
    procurementSummary: "Procurement of medical equipment for hospital modernization program.",
    keyRequirements: "FDA certification, ISO 13485, post-sales support agreement required.",
    budgetAbc: "₱12,300,000.00",
    deadline: "2025-02-28",
    aiConfidenceScore: 88,
    processingMethod: "gpt-4o",
    status: "failed",
    createdAt: "2024-11-05T11:30:00Z",
    updatedAt: "2024-11-25T09:15:00Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ProjectsPage() {
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
                <BreadcrumbLink href="/dashboard">QFindr</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">
                Manage your PhilGEPS projects and track bidding progress
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Active bidding opportunities</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱38.5M</div>
                <p className="text-xs text-muted-foreground">Combined project budgets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Currently bidding</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">Historical win rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by project title, agency, or PhilGEPS ID..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="status">Status</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
              <CardDescription>
                All your PhilGEPS projects and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Project ID</TableHead>
                      <TableHead className="min-w-[200px]">Project Title</TableHead>
                      <TableHead className="whitespace-nowrap">Procuring Entity</TableHead>
                      <TableHead className="whitespace-nowrap">Budget (ABC)</TableHead>
                      <TableHead className="whitespace-nowrap">Deadline</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">AI Score</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{project.projectId}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <Link 
                            href={`/projects/${project.id}`}
                            className="font-medium hover:text-blue-600 hover:underline cursor-pointer text-xs sm:text-sm"
                          >
                            {project.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{project.procuringEntity}</TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm">{project.budgetAbc}</TableCell>
                      <TableCell>
                        <div className="text-xs sm:text-sm">
                          {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs sm:text-sm font-medium">{project.aiConfidenceScore}%</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">({project.processingMethod})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
