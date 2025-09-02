"use client"

import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Globe,
  Download,
  Edit,
  Share2,
  AlertCircle,
  CheckCircle2,
  Timer,
  Brain
} from "lucide-react"

// Mock project data based on your actual schema
const getProjectById = (id: string) => {
  const projects = {
    "1": {
      id: 1,
      projectId: "25-08-912",
      refId: "REF-2024-001",
      title: "Supply and Delivery of Office Equipment",
      url: "https://philgeps.gov.ph/project/25-08-912",
      procuringEntity: "Department of Health - Central Office",
      areaOfDelivery: "Metro Manila",
      procurementSummary: "Supply and delivery of office equipment including computers, printers, and furniture for the main office building.",
      keyRequirements: "Must have valid DTI registration, Mayor's permit, Tax clearance certificate, and Omnibus sworn statement.",
      budgetAbc: "₱2,500,000.00",
      deadline: "2024-12-15",
      aiConfidenceScore: 85,
      processingMethod: "gpt-4o-mini",
      status: "completed",
      createdAt: "2024-11-01T08:00:00Z",
      updatedAt: "2024-11-15T14:30:00Z",
    },
    "2": {
      id: 2,
      projectId: "25-09-156",
      refId: "REF-2024-002",
      title: "IT Infrastructure Modernization Project",
      url: "https://philgeps.gov.ph/project/25-09-156",
      procuringEntity: "Department of Science and Technology - Regional Office",
      areaOfDelivery: "Metro Manila",
      procurementSummary: "Upgrade and modernization of IT infrastructure including servers, networking equipment, and software systems.",
      keyRequirements: "ICT certification, ISO 27001 certification, PCAB registration, and DTI business registration required.",
      budgetAbc: "₱15,800,000.00",
      deadline: "2025-01-20",
      aiConfidenceScore: 92,
      processingMethod: "gpt-4o",
      status: "processing",
      createdAt: "2024-11-10T09:15:00Z",
      updatedAt: "2024-11-20T16:45:00Z",
    },
    "3": {
      id: 3,
      projectId: "25-10-234",
      refId: "REF-2024-003",
      title: "Construction Materials Supply",
      url: "https://philgeps.gov.ph/project/25-10-234",
      procuringEntity: "Department of Public Works and Highways - Region IV-A",
      areaOfDelivery: "Laguna, Philippines",
      procurementSummary: "Supply of construction materials including cement, steel bars, aggregates for various infrastructure projects.",
      keyRequirements: "Valid business permits, tax clearance, and material quality certifications required.",
      budgetAbc: "₱8,200,000.00",
      deadline: "2024-11-30",
      aiConfidenceScore: 78,
      processingMethod: "gpt-4o-mini",
      status: "pending",
      createdAt: "2024-10-20T10:00:00Z",
      updatedAt: "2024-11-01T12:20:00Z",
    }
  }

  return projects[id as keyof typeof projects] || null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "processing": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "failed": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4" />
    case "processing": return <Timer className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    case "failed": return <AlertCircle className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const project = getProjectById(params.id as string)

  if (!project) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Project Not Found</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
                <p className="text-muted-foreground">The requested project could not be found.</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/dashboard">QFindr</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[150px] sm:max-w-none">{project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-2 min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{project.title}</h1>
              <p className="text-sm md:text-base text-muted-foreground break-words">{project.procuringEntity}</p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:ml-4">
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  View on PhilGEPS
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Status and Key Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge className={getStatusColor(project.status)}>
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">{project.status}</span>
            </Badge>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{project.budgetAbc}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">Due {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{project.areaOfDelivery}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">{project.projectId}</span>
            </div>
          </div>

          {/* AI Confidence Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Brain className="h-5 w-5 mr-2" />
                AI Analysis Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Score</span>
                  <span>{project.aiConfidenceScore}%</span>
                </div>
                <Progress value={project.aiConfidenceScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Processed using {project.processingMethod}
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs sm:text-sm">Requirements</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">Procurement Summary</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{project.procurementSummary}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium">Project ID:</span>
                        <p className="text-muted-foreground break-all">{project.projectId}</p>
                      </div>
                      <div>
                        <span className="font-medium">Reference ID:</span>
                        <p className="text-muted-foreground break-all">{project.refId}</p>
                      </div>
                      <div>
                        <span className="font-medium">Budget (ABC):</span>
                        <p className="text-muted-foreground">{project.budgetAbc}</p>
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span>
                        <p className="text-muted-foreground">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Area of Delivery:</span>
                        <p className="text-muted-foreground">{project.areaOfDelivery}</p>
                      </div>
                      <div>
                        <span className="font-medium">Processing Method:</span>
                        <p className="text-muted-foreground">{project.processingMethod}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Processing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium">Status:</span>
                        <div className="mt-1">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">AI Confidence Score:</span>
                        <p className="text-muted-foreground">{project.aiConfidenceScore}%</p>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <p className="text-muted-foreground">{new Date(project.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <p className="text-muted-foreground">{new Date(project.updatedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">PhilGEPS URL:</span>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline text-xs sm:text-sm break-all">
                          {project.url}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Requirements</CardTitle>
                  <CardDescription className="text-sm">Requirements extracted from the project posting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                    {project.keyRequirements}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Documents</CardTitle>
                  <CardDescription className="text-sm">AI-generated bidding documents for this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No documents generated yet.</p>
                    <Button className="mt-4 w-full sm:w-auto">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Activity</CardTitle>
                  <CardDescription className="text-sm">Recent updates and changes to this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Project updated</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Project created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
