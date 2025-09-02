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
import { 
  Workflow, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Copy,
  ExternalLink,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  RefreshCw
} from "lucide-react"

// Mock data for n8n workflows
const workflows = [
  {
    id: 1,
    name: "PhilGEPS Project Scraper",
    description: "Automatically scrapes new project listings from PhilGEPS website",
    status: "active",
    lastRun: "2024-11-10T10:30:00Z",
    nextRun: "2024-11-10T12:00:00Z",
    executions: 45,
    successRate: 98,
    trigger: "Schedule (Every 2 hours)",
    nodes: 12,
    category: "Data Collection",
  },
  {
    id: 2,
    name: "Document Generator Pipeline",
    description: "AI-powered document generation workflow for bidding materials",
    status: "running",
    lastRun: "2024-11-10T11:00:00Z",
    nextRun: null,
    executions: 23,
    successRate: 91,
    trigger: "Webhook",
    nodes: 18,
    category: "AI Processing",
  },
  {
    id: 3,
    name: "Notification System",
    description: "Sends alerts for project deadlines and workflow completion",
    status: "paused",
    lastRun: "2024-11-09T16:45:00Z",
    nextRun: null,
    executions: 156,
    successRate: 95,
    trigger: "Event-based",
    nodes: 8,
    category: "Notifications",
  },
  {
    id: 4,
    name: "Data Validation & Cleanup",
    description: "Validates and cleans scraped project data before processing",
    status: "active",
    lastRun: "2024-11-10T10:15:00Z",
    nextRun: "2024-11-10T14:00:00Z",
    executions: 78,
    successRate: 89,
    trigger: "Manual & Schedule",
    nodes: 15,
    category: "Data Processing",
  },
  {
    id: 5,
    name: "Compliance Checker",
    description: "Automated compliance verification for generated documents",
    status: "error",
    lastRun: "2024-11-10T09:30:00Z",
    nextRun: "2024-11-10T13:00:00Z",
    executions: 34,
    successRate: 76,
    trigger: "Queue",
    nodes: 22,
    category: "Quality Assurance",
    errorMessage: "API rate limit exceeded",
  },
];

const workflowExecutions = [
  {
    id: 1,
    workflowId: 1,
    workflowName: "PhilGEPS Project Scraper",
    status: "success",
    startTime: "2024-11-10T10:30:00Z",
    endTime: "2024-11-10T10:35:00Z",
    duration: "5m 23s",
    itemsProcessed: 12,
  },
  {
    id: 2,
    workflowId: 2,
    workflowName: "Document Generator Pipeline",
    status: "running",
    startTime: "2024-11-10T11:00:00Z",
    endTime: null,
    duration: "15m 30s",
    itemsProcessed: 3,
  },
  {
    id: 3,
    workflowId: 4,
    workflowName: "Data Validation & Cleanup",
    status: "success",
    startTime: "2024-11-10T10:15:00Z",
    endTime: "2024-11-10T10:18:00Z",
    duration: "3m 12s",
    itemsProcessed: 8,
  },
  {
    id: 4,
    workflowId: 5,
    workflowName: "Compliance Checker",
    status: "error",
    startTime: "2024-11-10T09:30:00Z",
    endTime: "2024-11-10T09:32:00Z",
    duration: "2m 45s",
    itemsProcessed: 0,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "running":
      return "bg-blue-100 text-blue-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "success":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "running":
      return <Activity className="h-4 w-4" />;
    case "paused":
      return <Pause className="h-4 w-4" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function WorkflowPage() {
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
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
              <p className="text-muted-foreground">
                Monitor and manage your n8n automation workflows
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open n8n
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflows.length}</div>
                <p className="text-xs text-muted-foreground">Automation processes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'active' || w.status === 'running').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Average across all workflows</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.reduce((acc, w) => acc + w.executions, 0)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by workflow name or description..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="status">Status</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="running">Running</option>
                    <option value="paused">Paused</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="w-48">
                  <Label htmlFor="category">Category</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Categories</option>
                    <option value="Data Collection">Data Collection</option>
                    <option value="AI Processing">AI Processing</option>
                    <option value="Notifications">Notifications</option>
                    <option value="Data Processing">Data Processing</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflows Table */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
              <CardDescription>
                Monitor and control your automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {workflow.nodes} nodes • {workflow.trigger}
                          </div>
                          {workflow.errorMessage && (
                            <div className="text-xs text-red-600 mt-1">
                              {workflow.errorMessage}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(workflow.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(workflow.status)}
                            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{workflow.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(workflow.lastRun).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(workflow.lastRun).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {workflow.nextRun ? (
                          <div className="text-sm">
                            <div>{new Date(workflow.nextRun).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(workflow.nextRun).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{workflow.successRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${workflow.successRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{workflow.executions}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {workflow.status === 'active' && (
                            <Button variant="ghost" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {workflow.status === 'paused' && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>
                Latest workflow execution results and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Items Processed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowExecutions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell className="font-medium">
                        {execution.workflowName}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(execution.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(execution.status)}
                            {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(execution.startTime).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(execution.startTime).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>{execution.duration}</TableCell>
                      <TableCell>{execution.itemsProcessed} items</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
