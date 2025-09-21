"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  AlertCircle
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

// Types based on your schema
interface RepositoryItem {
  id: string
  clientId: string
  name: string | null
  category: string | null
  type: string | null
  brand: string | null
  model: string | null
  serialNumber: string | null
  purchaseDate: string | null
  warrantyExpiry: string | null
  cost: number | null
  currentValue: number | null
  location: string | null
  status: string | null
  specifications: any | null
  integrations: any | null
  licenses: any | null
  maintenance: any | null
  compliance: any | null
  riskAssessment: any | null
  notes: string | null
  lastAuditDate: string | null
  nextMaintenanceDate: string | null
  createdAt: string
  updatedAt: string
}

export default function RepositoryPage() {
  const [items, setItems] = useState<RepositoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Simulated data based on your schema
  useEffect(() => {
    const fetchRepositoryItems = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with real API call to your database
        // const response = await db.select().from(clientRepositories).where(eq(clientRepositories.clientId, currentClientId))
        
        const mockItems: RepositoryItem[] = [
          {
            id: "1",
            clientId: "client-1",
            name: "Primary Database Server",
            category: "IT Infrastructure",
            type: "Server",
            brand: "Dell",
            model: "PowerEdge R750",
            serialNumber: "DLL-R750-001",
            purchaseDate: "2023-06-15",
            warrantyExpiry: "2026-06-15",
            cost: 150000.00,
            currentValue: 120000.00,
            location: "Data Center - Rack A1",
            status: "Active",
            specifications: {
              cpu: "Intel Xeon Silver 4314",
              memory: "64GB DDR4",
              storage: "2TB SSD",
              network: "Dual 10Gb Ethernet"
            },
            integrations: {
              backupSystem: "Veeam Backup",
              monitoring: "Nagios",
              deployment: "VMware vSphere"
            },
            licenses: {
              os: "Windows Server 2022 Standard",
              database: "SQL Server 2022 Enterprise",
              monitoring: "PRTG Network Monitor"
            },
            maintenance: {
              schedule: "Monthly",
              lastService: "2024-01-15",
              nextService: "2024-02-15",
              provider: "Dell Technologies"
            },
            compliance: {
              iso27001: true,
              dataPrivacy: true,
              backupPolicy: true
            },
            riskAssessment: {
              level: "Medium",
              factors: ["Hardware age", "Critical data storage"],
              mitigation: "Regular backups, redundancy"
            },
            notes: "Critical production server hosting main database",
            lastAuditDate: "2024-01-10",
            nextMaintenanceDate: "2024-02-15",
            createdAt: "2023-06-15T08:00:00Z",
            updatedAt: "2024-01-15T10:30:00Z"
          },
          {
            id: "2",
            clientId: "client-1",
            name: "Network Firewall",
            category: "Security",
            type: "Firewall",
            brand: "Fortinet",
            model: "FortiGate 200E",
            serialNumber: "FGT-200E-002",
            purchaseDate: "2023-03-20",
            warrantyExpiry: "2025-03-20",
            cost: 75000.00,
            currentValue: 60000.00,
            location: "Network Operations Center",
            status: "Active",
            specifications: {
              throughput: "20 Gbps",
              concurrent_sessions: "500000",
              vpn_tunnels: "2000",
              interfaces: "16x GE RJ45"
            },
            integrations: {
              siem: "Splunk Enterprise",
              logging: "Syslog server",
              management: "FortiManager"
            },
            licenses: {
              utm: "Unified Threat Management",
              vpn: "FortiClient VPN",
              support: "FortiCare Premium"
            },
            maintenance: {
              schedule: "Quarterly",
              lastService: "2024-01-10",
              nextService: "2024-04-10",
              provider: "Fortinet Partner"
            },
            compliance: {
              pci_dss: true,
              iso27001: true,
              cybersecurity_framework: true
            },
            riskAssessment: {
              level: "High",
              factors: ["Critical security component", "Internet facing"],
              mitigation: "24/7 monitoring, automatic updates"
            },
            notes: "Main perimeter security device protecting internal network",
            lastAuditDate: "2024-01-05",
            nextMaintenanceDate: "2024-04-10",
            createdAt: "2023-03-20T08:00:00Z",
            updatedAt: "2024-01-10T14:15:00Z"
          },
          {
            id: "3",
            clientId: "client-1",
            name: "Employee Workstations",
            category: "End User Computing",
            type: "Desktop",
            brand: "HP",
            model: "EliteDesk 800 G9",
            serialNumber: "HP-800G9-BATCH",
            purchaseDate: "2023-08-01",
            warrantyExpiry: "2026-08-01",
            cost: 500000.00,
            currentValue: 400000.00,
            location: "Office Floor 1-3",
            status: "Active",
            specifications: {
              cpu: "Intel Core i5-12500",
              memory: "16GB DDR4",
              storage: "512GB SSD",
              graphics: "Intel UHD Graphics 770"
            },
            integrations: {
              domain: "Active Directory",
              backup: "OneDrive for Business",
              security: "Windows Defender"
            },
            licenses: {
              os: "Windows 11 Pro (25 licenses)",
              office: "Microsoft 365 Business Premium",
              antivirus: "Windows Defender (included)"
            },
            maintenance: {
              schedule: "Semi-annual",
              lastService: "2023-12-01",
              nextService: "2024-06-01",
              provider: "HP Services"
            },
            compliance: {
              gdpr: true,
              data_encryption: true,
              access_control: true
            },
            riskAssessment: {
              level: "Low",
              factors: ["Standard business use", "Regular updates"],
              mitigation: "Automated patching, endpoint protection"
            },
            notes: "25 units deployed across office floors for general staff use",
            lastAuditDate: "2023-12-15",
            nextMaintenanceDate: "2024-06-01",
            createdAt: "2023-08-01T08:00:00Z",
            updatedAt: "2023-12-01T09:45:00Z"
          }
        ]
        
        setItems(mockItems)
      } catch (error) {
        console.error('Error fetching repository items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositoryItems()
  }, [])

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not specified"
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case 'retired':
        return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>
      case 'faulty':
        return <Badge className="bg-red-100 text-red-800">Faulty</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getComplianceIcon = (isCompliant: boolean) => {
    return isCompliant ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />
  }

  const getCategoryIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'it infrastructure':
        return <Server className="h-4 w-4" />
      case 'security':
        return <Shield className="h-4 w-4" />
      case 'end user computing':
        return <Monitor className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
      item.category?.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesStatus = selectedStatus === "all" ||
      item.status?.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate stats
  const totalValue = items.reduce((sum, item) => sum + (item.currentValue || 0), 0)
  const activeItems = items.filter(item => item.status?.toLowerCase() === 'active').length
  const maintenanceDue = items.filter(item => {
    if (!item.nextMaintenanceDate) return false
    const nextMaintenance = new Date(item.nextMaintenanceDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    return nextMaintenance <= thirtyDaysFromNow
  }).length

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

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Repository</h1>
            <p className="text-muted-foreground">
              Manage your equipment, software licenses, and IT assets
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
              <p className="text-xs text-muted-foreground">Tracked items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Current asset value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeItems}</div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceDue}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, brand, model, or serial number..."
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
                  <option value="it infrastructure">IT Infrastructure</option>
                  <option value="security">Security</option>
                  <option value="end user computing">End User Computing</option>
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
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                  <option value="faulty">Faulty</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Inventory</CardTitle>
            <CardDescription>
              {filteredItems.length} asset{filteredItems.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="font-medium">{item.name || 'Unnamed Asset'}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.brand} {item.model}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              S/N: {item.serialNumber}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{item.location}</div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.currentValue)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        {item.riskAssessment?.level && getRiskBadge(item.riskAssessment.level)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(item.nextMaintenanceDate)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
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
      </div>
    </>
  )
}