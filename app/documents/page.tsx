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
import { FileText, Search, Plus, Download, Eye, Edit, Trash2, Bot, Calendar } from "lucide-react"

// Mock data for documents
const documents = [
  {
    id: 1,
    title: "Technical Specifications - Office Equipment",
    type: "Technical Specification",
    projectId: "25-08-912",
    projectTitle: "Supply and Delivery of Office Equipment",
    status: "completed",
    aiGenerated: true,
    version: 2,
    lastModified: "2024-11-10T10:30:00Z",
    fileSize: "2.4 MB",
    format: "PDF",
  },
  {
    id: 2,
    title: "Financial Proposal - IT Infrastructure",
    type: "Financial Proposal",
    projectId: "25-09-156",
    projectTitle: "IT Infrastructure Modernization Project",
    status: "draft",
    aiGenerated: true,
    version: 1,
    lastModified: "2024-11-09T14:45:00Z",
    fileSize: "1.8 MB",
    format: "DOCX",
  },
  {
    id: 3,
    title: "Compliance Statement - Construction Materials",
    type: "Compliance Statement",
    projectId: "25-08-745",
    projectTitle: "Construction Materials Supply",
    status: "in_review",
    aiGenerated: false,
    version: 3,
    lastModified: "2024-11-08T16:20:00Z",
    fileSize: "856 KB",
    format: "PDF",
  },
  {
    id: 4,
    title: "Project Timeline - Medical Equipment",
    type: "Project Schedule",
    projectId: "25-09-203",
    projectTitle: "Medical Equipment Procurement",
    status: "completed",
    aiGenerated: true,
    version: 1,
    lastModified: "2024-11-07T09:15:00Z",
    fileSize: "1.2 MB",
    format: "PDF",
  },
  {
    id: 5,
    title: "Quality Assurance Plan - Office Equipment",
    type: "QA Document",
    projectId: "25-08-912",
    projectTitle: "Supply and Delivery of Office Equipment",
    status: "generating",
    aiGenerated: true,
    version: 1,
    lastModified: "2024-11-10T11:00:00Z",
    fileSize: "-",
    format: "PDF",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "in_review":
      return "bg-blue-100 text-blue-800";
    case "generating":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const documentTypes = [
  "Technical Specification",
  "Financial Proposal", 
  "Compliance Statement",
  "Project Schedule",
  "QA Document",
  "Bid Form",
  "Company Profile",
];

export default function DocumentsPage() {
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
                <BreadcrumbPage>Documents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
              <p className="text-muted-foreground">
                Manage bidding documents and AI-generated content
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documents.filter(doc => doc.aiGenerated).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((documents.filter(doc => doc.aiGenerated).length / documents.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documents.filter(doc => doc.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for submission</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documents.filter(doc => doc.status === 'draft' || doc.status === 'generating').length}
                </div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by document title, project, or type..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="type">Document Type</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Types</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="w-48">
                  <Label htmlFor="status">Status</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="generating">Generating</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>
                All your bidding documents and generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Generated</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium">{document.title}</div>
                          <div className="text-sm text-muted-foreground">{document.format}</div>
                        </div>
                      </TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px]">
                          <div className="font-medium text-sm">{document.projectId}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {document.projectTitle}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status.replace('_', ' ').charAt(0).toUpperCase() + 
                           document.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {document.aiGenerated ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Bot className="mr-1 h-3 w-3" />
                            AI
                          </Badge>
                        ) : (
                          <Badge variant="outline">Manual</Badge>
                        )}
                      </TableCell>
                      <TableCell>v{document.version}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(document.lastModified).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(document.lastModified).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>{document.fileSize}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" disabled={document.status === 'generating'}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={document.status === 'generating'}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={document.status === 'generating'}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={document.status === 'generating'}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
