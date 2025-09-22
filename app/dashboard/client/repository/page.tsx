"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Server,
  HardDrive,
  Monitor,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  MoreHorizontal,
  X
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
import { AddRepositoryModal } from "./components/add-repository"
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
interface Repository {
  id: string
  clientId: string
  name: string
  type: "code" | "data" | "document" | "api" | "config"
  url?: string
  description?: string
  status: "active" | "archived" | "maintenance"
  environment: "production" | "staging" | "development" | "test"
  tags: string[]
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export default function RepositoryPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Simulated data based on your schema
  useEffect(() => {
    const fetchRepositoryItems = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with real API call to your database
        // const response = await db.select().from(clientRepositories).where(eq(clientRepositories.clientId, currentClientId))

        const mockRepositories: Repository[] = [
          {
            id: "repo-1",
            clientId: "client-1",
            name: "ABC Construction API",
            type: "api",
            url: "https://api.abcconstruction.com",
            description: "REST API for construction project management and bidding system",
            status: "active",
            environment: "production",
            tags: ["api", "rest", "construction", "bidding"],
            lastUpdated: "2024-01-20T10:30:00Z",
            createdAt: "2023-06-15T08:00:00Z",
            updatedAt: "2024-01-20T10:30:00Z"
          },
          {
            id: "repo-2",
            clientId: "client-1",
            name: "PhilGEPS Data Pipeline",
            type: "data",
            url: "https://github.com/abc-construction/philgeps-pipeline",
            description: "ETL pipeline for processing PhilGEPS tender data and notifications",
            status: "active",
            environment: "production",
            tags: ["etl", "data", "philgeps", "python"],
            lastUpdated: "2024-01-18T14:20:00Z",
            createdAt: "2023-08-01T09:00:00Z",
            updatedAt: "2024-01-18T14:20:00Z"
          },
          {
            id: "repo-3",
            clientId: "client-1",
            name: "Frontend Dashboard",
            type: "code",
            url: "https://github.com/abc-construction/dashboard",
            description: "React-based dashboard for project monitoring and analytics",
            status: "active",
            environment: "staging",
            tags: ["react", "dashboard", "analytics", "typescript"],
            lastUpdated: "2024-01-19T16:45:00Z",
            createdAt: "2023-07-10T11:00:00Z",
            updatedAt: "2024-01-19T16:45:00Z"
          },
          {
            id: "repo-4",
            clientId: "client-1",
            name: "Document Templates",
            type: "document",
            url: "https://docs.abcconstruction.com/templates",
            description: "Standard document templates for bids, contracts, and compliance",
            status: "active",
            environment: "production",
            tags: ["documents", "templates", "compliance", "legal"],
            lastUpdated: "2024-01-15T12:00:00Z",
            createdAt: "2023-05-20T10:00:00Z",
            updatedAt: "2024-01-15T12:00:00Z"
          },
          {
            id: "repo-5",
            clientId: "client-1",
            name: "Configuration Management",
            type: "config",
            url: "https://github.com/abc-construction/config",
            description: "Infrastructure as Code and configuration management",
            status: "maintenance",
            environment: "development",
            tags: ["iac", "terraform", "ansible", "config"],
            lastUpdated: "2024-01-10T08:30:00Z",
            createdAt: "2023-09-01T13:00:00Z",
            updatedAt: "2024-01-10T08:30:00Z"
          }
        ]

        setRepositories(mockRepositories)
      } catch (error) {
        console.error("Error fetching repositories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositoryItems()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Maintenance</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Archived</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRepositoryIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Server className="h-4 w-4" />
      case "data":
        return <HardDrive className="h-4 w-4" />
      case "api":
        return <Package className="h-4 w-4" />
      case "document":
        return <Monitor className="h-4 w-4" />
      case "config":
        return <Shield className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = !searchTerm ||
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = selectedType === "all" || repo.type === selectedType
    const matchesStatus = selectedStatus === "all" || repo.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => {
    let aValue: any = a[sortColumn as keyof Repository]
    let bValue: any = b[sortColumn as keyof Repository]

    if (sortColumn === "lastUpdated" || sortColumn === "createdAt") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleAddRepository = (newRepository: Omit<Repository, "id" | "createdAt" | "updatedAt">) => {
    const repository: Repository = {
      ...newRepository,
      id: `repo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setRepositories(prev => [...prev, repository])
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectRepository = (repositoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedRepositories(prev => [...prev, repositoryId])
    } else {
      setSelectedRepositories(prev => prev.filter(id => id !== repositoryId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRepositories(filteredRepositories.map(repo => repo.id))
    } else {
      setSelectedRepositories([])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedRepositories.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedRepositories.length} selected repositories?`)) {
      setRepositories(repositories.filter(repo => !selectedRepositories.includes(repo.id)))
      setSelectedRepositories([])
    }
  }

  // Calculate stats
  const totalRepositories = repositories.length
  const activeRepositories = repositories.filter(repo => repo.status === "active").length
  const maintenanceCount = repositories.filter(repo => repo.status === "maintenance").length

  if (isLoading) {
    return <LoadingScreen message="Loading repository..." size={100} />
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
              <BreadcrumbPage>Repository</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border-b relative">
          <div className="px-4 lg:px-6 py-8 md:py-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Repository Management</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    Manage your code repositories, APIs, data sources, and documentation
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Keep track of all your repositories across different environments and ensure proper organization and maintenance of your digital assets.
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6">

          {/* Filters and Search */}
          <div className="flex items-center justify-between gap-4">
            {/* Search on the left */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters on the right */}
            <div className="flex items-center gap-2">
              
              {/* Type Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="code">Code Repository</SelectItem>
                    <SelectItem value="data">Data Repository</SelectItem>
                    <SelectItem value="api">API Repository</SelectItem>
                    <SelectItem value="document">Document Repository</SelectItem>
                    <SelectItem value="config">Configuration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(selectedType !== "all" || selectedStatus !== "all") && (
                <div className="flex flex-col gap-1">
                  <div className="text-xs">&nbsp;</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedType("all")
                            setSelectedStatus("all")
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
            <div className="flex items-center justify-between mb-4">
             
              {selectedRepositories.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedRepositories.length})
                </Button>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRepositories.length === filteredRepositories.length && filteredRepositories.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 font-medium"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Repository
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 font-medium"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 font-medium"
                    onClick={() => handleSort("environment")}
                  >
                    <div className="flex items-center gap-2">
                      Environment
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 font-medium"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 font-medium"
                    onClick={() => handleSort("lastUpdated")}
                  >
                    <div className="flex items-center gap-2">
                      Last Updated
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="min-h-[400px]">
                {filteredRepositories.length === 0 ? (
                  <>
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Server className="h-8 w-8 mb-2" />
                          <p>No repositories found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Empty placeholder rows to give visual height */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <TableRow key={`empty-${i}`}>
                        <TableCell className="h-12"></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  filteredRepositories.map((repo) => (
                    <TableRow key={repo.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRepositories.includes(repo.id)}
                          onCheckedChange={(checked) => handleSelectRepository(repo.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getRepositoryIcon(repo.type)}
                          </div>
                          <div>
                            <div className="font-medium">{repo.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {repo.description}
                            </div>
                            {repo.url && (
                              <div className="text-xs text-muted-foreground">
                                {repo.url}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{repo.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{repo.environment}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(repo.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(repo.lastUpdated)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {repo.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {repo.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{repo.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Repository
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Repository
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <AddRepositoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRepository}
        />
      </div>
    </>
  )
}
