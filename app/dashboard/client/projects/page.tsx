"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Search, 
  MapPin,
  Eye,
  Trash2,
  MoreHorizontal,
  Download,
  ArrowUpDown,
  RefreshCw,
  X,
  Server
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Types based on your schema
interface Project {
  id: string
  clientId: string
  publishAt: string | null
  closingAt: string | null
  title: string | null
  referenceNumber: string | null
  procuringEntity: string | null
  philgepsTitle: string | null
  areaOfDelivery: string | null
  solicitationNumber: string | null
  tradeAgreement: string | null
  procurementMode: string | null
  classification: string | null
  category: string | null
  abc: number | null
  deliveryPeriod: string | null
  bidSupplements: any[]
  documentRequestList: any[]
  datePublished: string | null
  lastUpdatedAt: string | null
  parsedClosingAt: string | null
  description: string | null
  prebidConferences: any[]
  prebidFirstDate: string | null
  prebidFirstTime: string | null
  prebidFirstVenue: string | null
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProcurementMode, setSelectedProcurementMode] = useState("all")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch data from dashboard API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        // Transform the data to match the expected Project interface
        const transformedProjects: Project[] = data.recentProjects.map((project: any) => ({
          id: project.id.toString(),
          clientId: "client-1", // Default client ID
          publishAt: project.createdAt,
          closingAt: project.parsedClosingAt,
          title: project.title,
          referenceNumber: `REF-${project.id}`,
          procuringEntity: project.procuringEntity,
          philgepsTitle: project.title,
          areaOfDelivery: "Nationwide",
          solicitationNumber: `SOL-${project.id}`,
          tradeAgreement: "GPPB",
          procurementMode: "Public Bidding",
          classification: project.category === "Construction" ? "Infrastructure" : "Goods",
          category: project.category,
          abc: project.abc,
          deliveryPeriod: "30 days",
          bidSupplements: [],
          documentRequestList: [],
          datePublished: project.createdAt,
          lastUpdatedAt: project.createdAt,
          parsedClosingAt: project.parsedClosingAt,
          description: project.title,
          prebidConferences: [],
          prebidFirstDate: null,
          prebidFirstTime: null,
          prebidFirstVenue: null,
          createdAt: project.createdAt,
          updatedAt: project.createdAt
        }))
        setProjects(transformedProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not specified"
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilClosing = (closingDate: string | null) => {
    if (!closingDate) return null
    const now = new Date()
    const closing = new Date(closingDate)
    const diffTime = closing.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityBadge = (category: string | null) => {
    if (category === "Construction") return <span className="text-red-500">↑ High</span>
    if (category === "Services") return <span className="text-orange-500">→ Medium</span>
    return <span className="text-green-500">↓ Low</span>
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(filteredProjects.map(p => p.id))
    } else {
      setSelectedProjects([])
    }
  }

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId])
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId))
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // Convert projects to CSV
    const headers = ['Project ID', 'Title', 'Entity Name', 'Classification', 'Closing Date', 'ABC Value']
    const csvContent = [
      headers.join(','),
      ...filteredProjects.map(project => [
        project.id,
        `"${project.title || 'Untitled Project'}"`,
        `"${project.procuringEntity || 'Not specified'}"`,
        project.classification || 'Not specified',
        formatDate(project.closingAt),
        project.abc || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleBulkDelete = () => {
    if (selectedProjects.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedProjects.length} selected projects?`)) {
      setProjects(projects.filter(p => !selectedProjects.includes(p.id)))
      setSelectedProjects([])
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.procuringEntity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.philgepsTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
      project.category?.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesProcurementMode = selectedProcurementMode === "all" ||
      project.procurementMode?.toLowerCase() === selectedProcurementMode.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesProcurementMode
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading) {
    return <LoadingScreen message="Loading projects..." size={100} />
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
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
      

    {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border-b relative">
          <div className="px-4 lg:px-6 py-8 md:py-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">PhilGEPS Projects  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                Discover and manage Philippine government procurement opportunities tailored to your business.
               </p>
                </div>
              </div>
             
            </div>
          </div>
         
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          {/* Search on the left */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters on the right */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Procurement Mode Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Procurement Mode</label>
              <Select value={selectedProcurementMode} onValueChange={setSelectedProcurementMode}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Procurement Modes</SelectItem>
                  <SelectItem value="public bidding">Public Bidding</SelectItem>
                  <SelectItem value="alternative methods">Alternative Methods</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== "all" || selectedProcurementMode !== "all") && (
              <div className="flex flex-col gap-1">
                <div className="text-xs">&nbsp;</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all")
                          setSelectedProcurementMode("all")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear all filters</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

         
          </div>
        </div>

              {/* Modern Table */}
        <div className="rounded-lg border px-4 py-2 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    Project
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('procuringEntity')}
                >
                  <div className="flex items-center gap-2">
                    Entity Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('classification')}
                >
                  <div className="flex items-center gap-2">
                    Classification
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('closingAt')}
                >
                  <div className="flex items-center gap-2">
                    Closing Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-2">
                    Priority
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 font-medium"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Created At
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[400px]">
              {paginatedProjects.length === 0 ? (
                <>
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Building2 className="h-8 w-8 mb-2" />
                        <p>No projects found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Empty placeholder rows to give visual height */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <TableRow key={`empty-${i}`} className="opacity-30">
                      <TableCell className="h-12"></TableCell>
                      <TableCell className="h-12">
                        <div className="w-16 h-4 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="space-y-1">
                          <div className="w-32 h-3 bg-muted rounded"></div>
                          <div className="w-20 h-3 bg-muted/60 rounded"></div>
                        </div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="space-y-1">
                          <div className="w-28 h-3 bg-muted rounded"></div>
                          <div className="w-24 h-3 bg-muted/60 rounded"></div>
                        </div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="w-20 h-5 bg-muted rounded-full"></div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="space-y-1">
                          <div className="w-20 h-3 bg-muted rounded"></div>
                          <div className="w-16 h-3 bg-muted/60 rounded"></div>
                        </div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="w-12 h-3 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                      </TableCell>
                      <TableCell className="h-12">
                        <div className="w-6 h-6 bg-muted rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {paginatedProjects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      className={`hover:bg-muted/50 ${selectedProjects.includes(project.id) ? 'bg-muted/30' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {project.id}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">
                            {project.title || 'Untitled Project'}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {project.referenceNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium truncate">
                            {project.procuringEntity || 'Not specified'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {project.areaOfDelivery || 'Not specified'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            project.classification === 'Infrastructure' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            project.classification === 'Goods' ? 'bg-green-50 text-green-700 border-green-200' :
                            project.classification === 'Consulting Services' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {project.classification || project.category || 'Not specified'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {formatDate(project.closingAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getDaysUntilClosing(project.closingAt) !== null && 
                             getDaysUntilClosing(project.closingAt)! > 0 
                              ? `${getDaysUntilClosing(project.closingAt)} days left`
                              : getDaysUntilClosing(project.closingAt) === 0 
                                ? 'Closing today' 
                                : 'Closed'
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(project.category)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(project.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/client/projects/${project.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fill remaining rows to maintain consistent height */}
                  {paginatedProjects.length < itemsPerPage && 
                    Array.from({ length: itemsPerPage - paginatedProjects.length }, (_, i) => (
                      <TableRow key={`fill-${i}`}>
                        <TableCell className="h-12" colSpan={9}></TableCell>
                      </TableRow>
                    ))
                  }
                </>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedProjects.length} of {filteredProjects.length} row(s) selected.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    ««
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    »»
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}