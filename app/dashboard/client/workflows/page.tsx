"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Square, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  BarChart3,
  Target
} from "lucide-react"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for workflow management
interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  duration?: number
  startTime?: string
  endTime?: string
  logs?: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  category: 'data_scraping' | 'analysis' | 'notification' | 'reporting'
  status: 'active' | 'paused' | 'stopped' | 'error'
  lastRun: string | null
  nextRun: string | null
  totalRuns: number
  successRate: number
  avgDuration: number
  steps: WorkflowStep[]
  schedule: string
  createdAt: string
  updatedAt: string
}

interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: 'running' | 'completed' | 'failed'
  startTime: string
  endTime?: string
  duration?: number
  stepsPassed: number
  totalSteps: number
  errorMessage?: string
  projectsProcessed?: number
  dataExtracted?: number
}

// Types for workflow management
interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  duration?: number
  startTime?: string
  endTime?: string
  logs?: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  category: 'data_scraping' | 'analysis' | 'notification' | 'reporting'
  status: 'active' | 'paused' | 'stopped' | 'error'
  lastRun: string | null
  nextRun: string | null
  totalRuns: number
  successRate: number
  avgDuration: number
  steps: WorkflowStep[]
  schedule: string
  createdAt: string
  updatedAt: string
}

interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: 'running' | 'completed' | 'failed'
  startTime: string
  endTime?: string
  duration?: number
  stepsPassed: number
  totalSteps: number
  errorMessage?: string
  projectsProcessed?: number
  dataExtracted?: number
}

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Simulated data for PhilGEPS workflow management
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true)
      try {
        const mockWorkflows: Workflow[] = [
          {
            id: "1",
            name: "PhilGEPS Project Discovery",
            description: "Automated scraping of new PhilGEPS projects based on search criteria",
            category: "data_scraping",
            status: "active",
            lastRun: "2024-01-20T08:00:00Z",
            nextRun: "2024-01-20T20:00:00Z",
            totalRuns: 156,
            successRate: 98.7,
            avgDuration: 320,
            schedule: "Every 12 hours",
            steps: [],
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-20T08:05:20Z"
          },
          {
            id: "2",
            name: "Bid Deadline Alerts",
            description: "Send notifications for upcoming bid submission deadlines",
            category: "notification",
            status: "active", 
            lastRun: "2024-01-20T07:00:00Z",
            nextRun: "2024-01-21T07:00:00Z",
            totalRuns: 89,
            successRate: 100.0,
            avgDuration: 45,
            schedule: "Daily at 7:00 AM",
            steps: [],
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-20T07:00:45Z"
          }
        ]

        const mockExecutions: WorkflowExecution[] = [
          {
            id: "exec-1",
            workflowId: "1",
            workflowName: "PhilGEPS Project Discovery",
            status: "completed",
            startTime: "2024-01-20T08:00:00Z",
            endTime: "2024-01-20T08:05:20Z",
            duration: 320,
            stepsPassed: 4,
            totalSteps: 4,
            projectsProcessed: 15,
            dataExtracted: 450
          }
        ]
        
        setWorkflows(mockWorkflows)
        setExecutions(mockExecutions)
      } catch (error) {
        console.error('Error fetching workflows:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'stopped':
        return <Badge className="bg-gray-100 text-gray-800">Stopped</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_scraping':
        return <Search className="h-4 w-4" />
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />
      case 'notification':
        return <AlertTriangle className="h-4 w-4" />
      case 'reporting':
        return <Target className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = !searchTerm || 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
      workflow.category === selectedCategory
    
    const matchesStatus = selectedStatus === "all" ||
      workflow.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate stats
  const activeWorkflows = workflows.filter(w => w.status === 'active').length
  const runningExecutions = executions.filter(e => e.status === 'running').length
  const avgSuccessRate = workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length

  if (isLoading) {
    return <LoadingScreen message="Loading workflows..." size={100} />
  }

  return (
    <>
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard/client">QFindr</BreadcrumbLink>
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
              Manage automated PhilGEPS data processing and notification workflows
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWorkflows}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running Now</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runningExecutions}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average across all workflows</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workflows.reduce((sum, w) => sum + w.totalRuns, 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Recent Executions</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search workflows..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="data_scraping">Data Scraping</option>
                      <option value="analysis">Analysis</option>
                      <option value="notification">Notifications</option>
                      <option value="reporting">Reporting</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-48">
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="stopped">Stopped</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflows Table */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow List</CardTitle>
                <CardDescription>
                  {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[250px]">Workflow</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWorkflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {getCategoryIcon(workflow.category)}
                              </div>
                              <div>
                                <div className="font-medium">{workflow.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {workflow.description}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {workflow.totalRuns} total runs • Avg {formatDuration(workflow.avgDuration)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {workflow.category.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(workflow.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{workflow.schedule}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">
                                {workflow.successRate.toFixed(1)}%
                              </div>
                              <Progress 
                                value={workflow.successRate} 
                                className="w-16 h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(workflow.lastRun)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(workflow.nextRun)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
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
          </TabsContent>

          <TabsContent value="executions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>
                  Latest workflow execution history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Data Processed</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executions.map((execution) => (
                        <TableRow key={execution.id}>
                          <TableCell>
                            <div className="font-medium">{execution.workflowName}</div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(execution.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(execution.stepsPassed / execution.totalSteps) * 100} 
                                className="w-16 h-2"
                              />
                              <span className="text-sm text-muted-foreground">
                                {execution.stepsPassed}/{execution.totalSteps}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {execution.duration ? formatDuration(execution.duration) : 'Running...'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {execution.projectsProcessed ? `${execution.projectsProcessed} projects` : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(execution.startTime)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {execution.status === 'running' && (
                                <Button variant="ghost" size="sm">
                                  <Square className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  Detailed execution logs and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="text-green-600">[2024-01-20 08:05:20] PhilGEPS Project Discovery: Execution completed successfully</div>
                  <div className="text-blue-600">[2024-01-20 08:05:20] Stored 15 new projects in database</div>
                  <div className="text-blue-600">[2024-01-20 08:04:15] Data processing completed for 450 records</div>
                  <div className="text-blue-600">[2024-01-20 08:02:45] Extracted project data from search results</div>
                  <div className="text-blue-600">[2024-01-20 08:00:45] PhilGEPS portal search completed</div>
                  <div className="text-green-600">[2024-01-20 08:00:00] PhilGEPS Project Discovery: Started execution</div>
                  <div className="text-green-600">[2024-01-20 07:00:45] Bid Deadline Alerts: Execution completed successfully</div>
                  <div className="text-blue-600">[2024-01-20 07:00:35] Sent 3 deadline notifications</div>
                  <div className="text-blue-600">[2024-01-20 07:00:15] Generated notifications for 3 upcoming deadlines</div>
                  <div className="text-green-600">[2024-01-20 07:00:00] Bid Deadline Alerts: Started execution</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}