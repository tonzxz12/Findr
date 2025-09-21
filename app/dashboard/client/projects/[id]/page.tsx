"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  Clock, 
  Globe,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  Timer,
  Briefcase,
  Award,
  ArrowLeft,
} from "lucide-react"

// Import tab components
import { OverviewTab } from "./components/overview-tab"
import { DocumentsTab } from "./components/documents-tab"
import { TimelineTab } from "./components/timeline-tab"
import { ContactTab } from "./components/contact-tab"

interface Project {
  id: number
  title: string
  procuringEntity: string
  abc: number
  parsedClosingAt: string
  category: string
  createdAt: string
}



const getStatusIcon = (status: string) => {
  switch (status) {
    case "open": return <CheckCircle2 className="h-4 w-4" />
    case "closed": return <AlertCircle className="h-4 w-4" />
    case "processing": return <Timer className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    case "awarded": return <Award className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        // Fetch all projects from the dashboard API
        const response = await fetch('/api/dashboard')
        const data = await response.json()

        // Find the project by ID
        const foundProject = data.recentProjects.find((p: Project) => p.id.toString() === projectId)

        if (foundProject) {
          setProject(foundProject)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested project could not be found.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Enhanced project data with additional fields for the detail view
  const enhancedProject = {
    ...project,
    id: project.id.toString(), // Convert to string for tab components
    projectId: `PROJ-${project.id}`,
    refId: `REF-2024-${project.id.toString().padStart(3, '0')}`,
    url: `https://philgeps.gov.ph/project/${project.id}`,
    procuringEntityDetails: {
      contactPerson: "Procurement Officer",
      email: "procurement@gov.ph",
      phone: "+63 2 123-4567",
      address: "Government Office, Manila"
    },
    areaOfDelivery: "Nationwide",
    latitude: 14.5995,
    longitude: 120.9842,
    procurementSummary: project.title,
    referenceNumber: `2024-BAC-${project.id.toString().padStart(3, '0')}`,
    solicitationNumber: `SOL-2024-${project.id}`,
    tradeAgreement: "GPPB",
    procurementMode: "Public Bidding",
    classification: project.category === "Construction" ? "Infrastructure" : "Goods",
    deliveryPeriod: "30 days",
    description: project.title,
    publishAt: new Date(project.createdAt),
    closingAt: new Date(project.parsedClosingAt),
    parsedClosingAt: new Date(project.parsedClosingAt),
    datePublished: new Date(project.createdAt),
    lastUpdatedAt: new Date(project.createdAt),
    status: new Date(project.parsedClosingAt) > new Date() ? "open" : "closed",
    budgetAbc: `₱${project.abc.toLocaleString()}`,
    abc: project.abc.toString(), // Convert to string for tab components
    projectDuration: "30 days",
    submissionDeadline: new Date(project.parsedClosingAt).toLocaleDateString(),
    deadline: project.parsedClosingAt,
    bidOpeningDate: new Date(project.parsedClosingAt).toLocaleDateString(),
    fundSource: "General Fund",
    deliveryTerms: "FOB Destination",
    paymentTerms: "Net 30 days",
    updatedAt: project.createdAt,
    documents: [
      { name: "Bidding Documents", type: "PDF", size: "2.5 MB", downloadUrl: "https://drive.google.com/file/d/19Lo0xJ2iUhH3N5vFgQXSw6pOYe5vY4Ap/view?usp=sharing" },
      { name: "Technical Specifications", type: "PDF", size: "1.8 MB", downloadUrl: "https://drive.google.com/file/d/19Lo0xJ2iUhH3N5vFgQXSw6pOYe5vY4Ap/view?usp=sharing" },
      { name: "Bill of Quantities", type: "XLSX", size: "0.5 MB", downloadUrl: "https://drive.google.com/file/d/19Lo0xJ2iUhH3N5vFgQXSw6pOYe5vY4Ap/view?usp=sharing" }
    ],
    timeline: (() => {
      const events = [
        { date: project.createdAt.split('T')[0], event: "Project published", status: "completed" }
      ]

      // Generate 2-4 random events in September 2025
      const numEvents = Math.floor(Math.random() * 3) + 2 // 2-4 events
      const eventTypes = [
        "Pre-bid conference",
        "Technical evaluation",
        "Financial evaluation",
        "Post-qualification",
        "Contract award",
        "Mobilization",
        "Site preparation",
        "Progress inspection"
      ]

      for (let i = 0; i < numEvents; i++) {
        // Generate random date in September 2025 (1-30)
        const day = Math.floor(Math.random() * 30) + 1
        const dateString = `2025-09-${day.toString().padStart(2, '0')}`

        // Random event type
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

        // Random status
        const statuses = ["completed", "in-progress", "upcoming"]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        events.push({ date: dateString, event: eventType, status })
      }

      events.push({ date: project.parsedClosingAt.split('T')[0], event: "Bid closing", status: "pending" })

      // Sort by date
      return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })(),
    requirements: [
      "Valid business license",
      "Tax clearance certificate",
      "Proof of technical capability",
      "Financial statements"
    ],
    evaluationCriteria: [
      { criterion: "Technical Proposal", weight: 40 },
      { criterion: "Financial Proposal", weight: 60 }
    ],
    similarProjects: [],
    aiInsights: {
      riskLevel: "Low",
      recommendations: [
        "Ensure all documentation is complete",
        "Consider partnering with local firms",
        "Monitor bid closing date carefully"
      ],
      marketAnalysis: "Competitive market with multiple qualified bidders expected"
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col gap-4 p-6 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/client/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </a>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
              <p className="text-muted-foreground">
                View comprehensive project information and requirements
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={enhancedProject.url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                View on PhilGEPS
              </a>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Documents
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Project Hero Section */}
        <div className="rounded-lg border bg-card p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">
                  {getStatusIcon(enhancedProject.status)}
                  <span className="ml-1 capitalize">{enhancedProject.status}</span>
                </Badge>
                <Badge variant="outline">
                  <Building2 className="h-3 w-3 mr-1" />
                  {enhancedProject.projectId}
                </Badge>
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {enhancedProject.classification}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {project.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {enhancedProject.procurementSummary}
              </p>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{project.procuringEntity}</span>
              </div>
            </div>
            
            <div className="lg:w-80 space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{enhancedProject.budgetAbc}</div>
                  <div className="text-sm text-muted-foreground">Total Budget (ABC)</div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submission Due:</span>
                    <span className="font-medium">{enhancedProject.submissionDeadline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{enhancedProject.projectDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{enhancedProject.areaOfDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full h-auto p-0 bg-transparent">
            <div className="flex items-center justify-between w-full">
              <TabsTrigger 
                value="overview" 
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Overview</div>
                    <div className="text-xs opacity-70">Project details</div>
                  </div>
              </div>
            </TabsTrigger>
            
            <div className="w-12 h-px bg-border mx-1" />
            
            <TabsTrigger 
              value="documents" 
              className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  2
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-medium">Documents</div>
                  <div className="text-xs opacity-70">Download files</div>
                </div>
              </div>
            </TabsTrigger>              <div className="w-12 h-px bg-border mx-1" />
              
              <TabsTrigger 
                value="timeline" 
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    3
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Timeline</div>
                    <div className="text-xs opacity-70">Key dates</div>
                  </div>
                </div>
              </TabsTrigger>
              
              <div className="w-12 h-px bg-border mx-1" />
              
              <TabsTrigger 
                value="contact" 
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    4
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Contact</div>
                    <div className="text-xs opacity-70">Get in touch</div>
                  </div>
                </div>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab project={enhancedProject} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsTab project={enhancedProject} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineTab project={enhancedProject} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactTab project={enhancedProject} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}