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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Bot, 
  FileText, 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Settings
} from "lucide-react"

// Mock data for AI jobs
const aiJobs = [
  {
    id: 1,
    title: "Technical Specification Generator",
    project: "Office Equipment Supply (25-08-912)",
    type: "Technical Documentation",
    status: "running",
    progress: 65,
    startTime: "2024-11-10T10:30:00Z",
    estimatedCompletion: "2024-11-10T11:15:00Z",
    model: "GPT-4",
  },
  {
    id: 2,
    title: "Financial Proposal Analysis",
    project: "IT Infrastructure (25-09-156)",
    type: "Financial Analysis",
    status: "completed",
    progress: 100,
    startTime: "2024-11-10T09:00:00Z",
    completedTime: "2024-11-10T09:45:00Z",
    model: "GPT-4",
  },
  {
    id: 3,
    title: "Compliance Checker",
    project: "Construction Materials (25-08-745)",
    type: "Compliance Review",
    status: "queued",
    progress: 0,
    queuePosition: 2,
    model: "GPT-4",
  },
  {
    id: 4,
    title: "Project Risk Assessment",
    project: "Medical Equipment (25-09-203)",
    type: "Risk Analysis",
    status: "failed",
    progress: 30,
    startTime: "2024-11-10T08:00:00Z",
    errorMessage: "Insufficient project data provided",
    model: "GPT-4",
  },
];

const documentTemplates = [
  {
    id: 1,
    name: "Technical Specification",
    description: "Generate detailed technical specifications for equipment and services",
    category: "Technical",
    icon: "⚙️",
    estimatedTime: "10-15 minutes",
  },
  {
    id: 2,
    name: "Financial Proposal",
    description: "Create comprehensive financial proposals with cost breakdowns",
    category: "Financial",
    icon: "💰",
    estimatedTime: "15-20 minutes",
  },
  {
    id: 3,
    name: "Compliance Statement",
    description: "Generate compliance statements for PhilGEPS requirements",
    category: "Legal",
    icon: "📋",
    estimatedTime: "8-12 minutes",
  },
  {
    id: 4,
    name: "Project Timeline",
    description: "Create detailed project schedules and milestone plans",
    category: "Planning",
    icon: "📅",
    estimatedTime: "5-10 minutes",
  },
  {
    id: 5,
    name: "Risk Assessment",
    description: "Analyze project risks and mitigation strategies",
    category: "Analysis",
    icon: "⚠️",
    estimatedTime: "12-18 minutes",
  },
  {
    id: 6,
    name: "Quality Assurance Plan",
    description: "Generate comprehensive QA and testing procedures",
    category: "Quality",
    icon: "✅",
    estimatedTime: "10-15 minutes",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "queued":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "running":
      return <Clock className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "queued":
      return <Clock className="h-4 w-4" />;
    case "failed":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function AIGenerationPage() {
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
                <BreadcrumbPage>AI Generation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Generation</h1>
              <p className="text-muted-foreground">
                Create intelligent bidding documents with AI assistance
              </p>
            </div>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              AI Settings
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiJobs.length}</div>
                <p className="text-xs text-muted-foreground">AI generation tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aiJobs.filter(job => job.status === 'running').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">Successful completions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12m</div>
                <p className="text-xs text-muted-foreground">Per document</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Document Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>
                  Choose a template to generate AI-powered documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Generation</CardTitle>
                <CardDescription>
                  Create custom documents with specific requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-select">Select Project</Label>
                  <select 
                    id="project-select"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Choose a project...</option>
                    <option value="25-08-912">Office Equipment Supply (25-08-912)</option>
                    <option value="25-09-156">IT Infrastructure (25-09-156)</option>
                    <option value="25-08-745">Construction Materials (25-08-745)</option>
                    <option value="25-09-203">Medical Equipment (25-09-203)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="document-title">Document Title</Label>
                  <Input 
                    id="document-title"
                    placeholder="Enter document title..."
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements & Instructions</Label>
                  <Textarea 
                    id="requirements"
                    placeholder="Describe what you need in this document. Be specific about requirements, format, and any special considerations..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="ai-model">AI Model</Label>
                  <select 
                    id="ai-model"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="gpt-4">GPT-4 (Recommended)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                    <option value="claude">Claude (Alternative)</option>
                  </select>
                </div>

                <Button className="w-full">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Custom Document
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>AI Generation Queue</CardTitle>
              <CardDescription>
                Monitor your active and recent AI generation tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        {getStatusIcon(job.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.project}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">{job.type}</span>
                          <span className="text-xs text-muted-foreground">Model: {job.model}</span>
                          {job.status === 'running' && job.estimatedCompletion && (
                            <span className="text-xs text-muted-foreground">
                              ETA: {new Date(job.estimatedCompletion).toLocaleTimeString()}
                            </span>
                          )}
                          {job.status === 'queued' && job.queuePosition && (
                            <span className="text-xs text-muted-foreground">
                              Position: {job.queuePosition}
                            </span>
                          )}
                        </div>
                        {job.status === 'running' && (
                          <div className="mt-2">
                            <Progress value={job.progress} className="w-full" />
                            <span className="text-xs text-muted-foreground">{job.progress}% complete</span>
                          </div>
                        )}
                        {job.status === 'failed' && job.errorMessage && (
                          <p className="text-sm text-red-600 mt-1">{job.errorMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'running' && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {job.status === 'failed' && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {job.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
