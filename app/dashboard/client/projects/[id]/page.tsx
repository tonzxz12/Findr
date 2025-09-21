"use client"

import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  Brain,
  Briefcase,
  Shield,
  Award,
  Target,
  Plus,
  Filter,
  Search,
  ArrowLeft,
  ExternalLink,
  Copy,
  Star,
  Zap,
  Calendar as CalendarIcon,
  CheckCircle,
  Circle,
  ArrowRight
} from "lucide-react"

// Import tab components
import { OverviewTab } from "./components/overview-tab"
import { DocumentsTab } from "./components/documents-tab"
import { TimelineTab } from "./components/timeline-tab"
import { ContactTab } from "./components/contact-tab"
// Enhanced mock project data
const getProjectById = (id: string) => {
  const projects = {
    "PROJ-2814": {
      id: "PROJ-2814",
      projectId: "25-09-156",
      refId: "REF-2024-001",
      title: "Construction of Science and Technology Building Phase II",
      url: "https://philgeps.gov.ph/project/25-09-156",
      procuringEntity: "Department of Science and Technology",
      procuringEntityDetails: {
        contactPerson: "Eng. Roberto Cruz",
        email: "procurement@dost.gov.ph",
        phone: "+63 2 8837-2071",
        address: "DOST Compound, General Santos Avenue, Bicutan, Taguig City"
      },
      areaOfDelivery: "Taguig City, Metro Manila",
      latitude: 14.5995,
      longitude: 120.9842,
      procurementSummary: "The project involves the construction of a modern Science and Technology Building Phase II, including laboratory facilities, research spaces, administrative offices, and supporting infrastructure. The building will be a 5-story structure with basement parking and will house state-of-the-art equipment for various scientific research activities.",
      referenceNumber: "2024-BAC-001-25-09-156",
      solicitationNumber: "SOL-2024-156-DOST-001",
      tradeAgreement: "Philippines-Singapore Free Trade Agreement",
      procurementMode: "Public Bidding",
      classification: "Infrastructure",
      category: "Building Construction",
      abc: "75500000.00",
      deliveryPeriod: "18 months",
      description: "This project aims to construct a state-of-the-art Science and Technology Building to support the Department of Science and Technology's research initiatives. The facility will include advanced laboratories, research spaces, conference rooms, and administrative offices designed to foster innovation and collaboration in scientific research.",
      publishAt: new Date("2024-12-18T08:00:00Z"),
      closingAt: new Date("2024-02-15T17:00:00Z"),
      parsedClosingAt: new Date("2024-02-15T17:00:00Z"),
      datePublished: new Date("2024-12-18T08:00:00Z"),
      lastUpdatedAt: new Date("2024-12-19T14:30:00Z"),
      status: "open",
      budgetAbc: "₱75,500,000.00",
      projectDuration: "18 months",
      submissionDeadline: "February 15, 2024",
      deadline: "2024-02-15T17:00:00Z",
      bidOpeningDate: "February 20, 2024",
      fundSource: "General Fund",
      deliveryTerms: "FOB Destination",
      paymentTerms: "Progressive billing based on accomplished work",
      documents: [
        { name: "Bidding Documents", type: "PDF", size: "2.5 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" },
        { name: "Technical Specifications", type: "PDF", size: "1.8 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" },
        { name: "Bill of Quantities", type: "XLSX", size: "0.5 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" },
        { name: "Site Plan", type: "DWG", size: "3.2 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" }
      ],
      timeline: [
        { date: "2024-01-15", event: "Bidding documents posted", status: "completed" },
        { date: "2024-01-25", event: "Pre-bid conference", status: "completed" },
        { date: "2024-02-10", event: "Bid submission deadline", status: "upcoming" },
        { date: "2024-02-15", event: "Bid opening", status: "upcoming" },
        { date: "2024-02-20", event: "Post qualification", status: "upcoming" },
        { date: "2024-02-25", event: "Contract award", status: "upcoming" },
        { date: "2025-09-01", event: "Contract signing ceremony", status: "completed" },
        { date: "2025-09-10", event: "Mobilization and site preparation", status: "completed" },
        { date: "2025-09-18", event: "Foundation work begins", status: "in-progress" },
        { date: "2025-09-25", event: "First progress inspection", status: "upcoming" },
        { date: "2025-10-01", event: "Structural framework completion target", status: "upcoming" },
        { date: "2025-12-15", event: "Building envelope completion", status: "upcoming" }
      ],
      createdAt: "2024-12-18T08:00:00Z",
      updatedAt: "2024-12-19T14:30:00Z",
    
      contacts: [
        {
          name: "Eng. Roberto Cruz",
          position: "Procurement Officer",
          department: "Procurement Division",
          phone: "+63 2 8837-2071",
          email: "procurement@dost.gov.ph",
          address: "DOST Compound, General Santos Avenue, Bicutan, Taguig City"
        },
        {
          name: "Ms. Maria Santos",
          position: "Technical Evaluator",
          department: "Engineering Division",
          phone: "+63 2 8837-2072",
          email: "technical@dost.gov.ph"
        }
      ]
    },
    "PROJ-0276": {
      id: "PROJ-0276",
      projectId: "25-09-156",
      refId: "REF-2024-002",
      title: "Supply of Office Equipment for Digital Transformation",
      url: "https://philgeps.gov.ph/project/25-09-156",
      procuringEntity: "Department of Education - Central Office",
      procuringEntityDetails: {
        contactPerson: "Ms. Jennifer Cruz",
        email: "procurement@deped.gov.ph",
        phone: "+63 2 8636-1663",
        address: "DepEd Complex, Meralco Avenue, Pasig City"
      },
      areaOfDelivery: "Quezon City, Metro Manila",
      procurementSummary: "Supply and delivery of office equipment including desktop computers, laptops, printers, scanners, and office furniture to support the digital transformation initiative of the Department of Education.",
      referenceNumber: "2024-BAC-002-25-09-156",
      solicitationNumber: "SOL-2024-156-DEPED-002",
      tradeAgreement: "Philippines-Japan Economic Partnership Agreement",
      category: "Office Equipment & Supplies",
      abc: "25750000.00",
      description: "This procurement aims to equip DepEd offices with modern digital tools and furniture to enhance administrative efficiency and support the department's digital transformation goals. The equipment will be distributed across regional offices and central administrative units.",
      publishAt: new Date("2024-12-19T10:15:00Z"),
      closingAt: new Date("2024-01-30T17:00:00Z"),
      parsedClosingAt: new Date("2024-01-30T17:00:00Z"),
      datePublished: new Date("2024-12-19T10:15:00Z"),
      lastUpdatedAt: new Date("2024-12-20T16:45:00Z"),
      status: "processing",
      classification: "Goods",
      budgetAbc: "₱25,750,000.00",
      projectDuration: "60 days",
      submissionDeadline: "January 30, 2024",
      deadline: "2024-01-30T17:00:00Z",
      bidOpeningDate: "February 5, 2024",
      procurementMode: "Public Bidding",
      fundSource: "Special Fund",
      deliveryTerms: "FOB Destination with Installation",
      paymentTerms: "Payment upon complete delivery and acceptance",
      documents: [
        { name: "Technical Specifications", type: "PDF", size: "1.2 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" },
        { name: "Budget Breakdown", type: "XLSX", size: "0.8 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" },
        { name: "Terms of Reference", type: "DOCX", size: "0.5 MB", downloadUrl: "https://drive.google.com/file/d/18__JoGMLbbz0uzq-Fw4hp1yzY4wgsX7A/view?usp=drive_link" }
      ],
      timeline: [
        { date: "2024-01-10", event: "Bidding documents posted", status: "completed" },
        { date: "2024-01-20", event: "Pre-bid conference", status: "upcoming" },
        { date: "2024-01-30", event: "Bid submission deadline", status: "upcoming" },
        { date: "2024-02-05", event: "Bid opening", status: "upcoming" },
        { date: "2025-09-02", event: "Contract awarded to winning bidder", status: "completed" },
        { date: "2025-09-08", event: "Purchase order issuance", status: "completed" },
        { date: "2025-09-15", event: "Equipment procurement and manufacturing", status: "in-progress" },
        { date: "2025-09-22", event: "Quality inspection and testing", status: "upcoming" },
        { date: "2025-09-28", event: "Delivery to DepEd central office", status: "upcoming" },
        { date: "2025-10-05", event: "Installation and setup", status: "upcoming" },
        { date: "2025-10-12", event: "Training and handover", status: "upcoming" }
      ],
      createdAt: "2024-12-19T10:15:00Z",
      updatedAt: "2024-12-20T16:45:00Z",
      aiConfidenceScore: 92,
      processingMethod: "Advanced AI Matching"
    }
  }

  return projects[id as keyof typeof projects] || null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-green-100 text-green-800 border-green-200"
    case "closed": return "bg-red-100 text-red-800 border-red-200"
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200"
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "awarded": return "bg-purple-100 text-purple-800 border-purple-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
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
  const project = getProjectById(params.id as string)

  if (!project) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground">The requested project could not be found.</p>
          </div>
        </div>
      </div>
    )
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
              <a href={project.url} target="_blank" rel="noopener noreferrer">
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
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </Badge>
                <Badge variant="outline">
                  <Building2 className="h-3 w-3 mr-1" />
                  {project.projectId}
                </Badge>
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {project.classification}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {project.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {project.procurementSummary}
              </p>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{project.procuringEntity}</span>
              </div>
            </div>
            
            <div className="lg:w-80 space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{project.budgetAbc}</div>
                  <div className="text-sm text-muted-foreground">Total Budget (ABC)</div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submission Due:</span>
                    <span className="font-medium">{project.submissionDeadline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{project.projectDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{project.areaOfDelivery}</span>
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
            <OverviewTab project={project} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsTab project={project} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineTab project={project} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactTab project={project} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}