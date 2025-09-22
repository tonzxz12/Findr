"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  Search,
  Filter,
  Bell,
  TrendingUp,
  CalendarDays,
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
import { Separator } from "@/components/ui/separator"// Types based on your schema
interface ProjectEvent {
  id: string
  projectId: string
  title: string
  procuringEntity: string
  eventType: 'publication' | 'prebid' | 'closing' | 'deadline'
  date: string
  time?: string
  venue?: string
  description?: string
  abc?: number
  category?: string
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CalendarPage() {
  const [events, setEvents] = useState<ProjectEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ProjectEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  // Simulated data based on your schema
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with real API call to your database
        // Query projects and extract date events from publishAt, closingAt, prebidFirstDate
        
        const mockEvents: ProjectEvent[] = [
          // January 2025
          {
            id: "2025-01-01",
            projectId: "proj-2025-01",
            title: "Construction of Rural Health Center",
            procuringEntity: "Department of Health - Region I",
            eventType: "publication",
            date: "2025-01-05",
            description: "Rural health center construction project published",
            abc: 8500000,
            category: "Construction"
          },
          {
            id: "2025-01-02",
            projectId: "proj-2025-01",
            title: "Construction of Rural Health Center",
            procuringEntity: "Department of Health - Region I",
            eventType: "prebid",
            date: "2025-01-15",
            time: "09:00",
            venue: "DOH Regional Office, San Fernando",
            description: "Pre-bid conference for health center construction",
            abc: 8500000,
            category: "Construction"
          },
          {
            id: "2025-01-03",
            projectId: "proj-2025-01",
            title: "Construction of Rural Health Center",
            procuringEntity: "Department of Health - Region I",
            eventType: "closing",
            date: "2025-01-25",
            time: "17:00",
            description: "Bid submission deadline for health center project",
            abc: 8500000,
            category: "Construction"
          },
          {
            id: "2025-01-04",
            projectId: "proj-2025-02",
            title: "Supply of Medical Equipment",
            procuringEntity: "Philippine General Hospital",
            eventType: "publication",
            date: "2025-01-10",
            description: "Medical equipment procurement published",
            abc: 3200000,
            category: "Medical Supplies"
          },

          // February 2025
          {
            id: "2025-02-01",
            projectId: "proj-2025-02",
            title: "Supply of Medical Equipment",
            procuringEntity: "Philippine General Hospital",
            eventType: "prebid",
            date: "2025-02-05",
            time: "10:00",
            venue: "PGH Procurement Office",
            description: "Pre-bid conference for medical equipment",
            abc: 3200000,
            category: "Medical Supplies"
          },
          {
            id: "2025-02-02",
            projectId: "proj-2025-02",
            title: "Supply of Medical Equipment",
            procuringEntity: "Philippine General Hospital",
            eventType: "closing",
            date: "2025-02-15",
            time: "16:00",
            description: "Bid submission deadline for medical equipment",
            abc: 3200000,
            category: "Medical Supplies"
          },
          {
            id: "2025-02-03",
            projectId: "proj-2025-03",
            title: "Road Rehabilitation Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "publication",
            date: "2025-02-08",
            description: "Highway rehabilitation project published",
            abc: 25000000,
            category: "Infrastructure"
          },
          {
            id: "2025-02-04",
            projectId: "proj-2025-03",
            title: "Road Rehabilitation Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "prebid",
            date: "2025-02-20",
            time: "13:00",
            venue: "DPWH District Office",
            description: "Pre-bid conference for road rehabilitation",
            abc: 25000000,
            category: "Infrastructure"
          },

          // March 2025
          {
            id: "2025-03-01",
            projectId: "proj-2025-03",
            title: "Road Rehabilitation Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "closing",
            date: "2025-03-05",
            time: "17:00",
            description: "Bid submission deadline for road project",
            abc: 25000000,
            category: "Infrastructure"
          },
          {
            id: "2025-03-02",
            projectId: "proj-2025-04",
            title: "IT Equipment Procurement",
            procuringEntity: "Bureau of Internal Revenue",
            eventType: "publication",
            date: "2025-03-10",
            description: "Computer equipment and software procurement",
            abc: 12000000,
            category: "IT Equipment"
          },
          {
            id: "2025-03-03",
            projectId: "proj-2025-04",
            title: "IT Equipment Procurement",
            procuringEntity: "Bureau of Internal Revenue",
            eventType: "prebid",
            date: "2025-03-18",
            time: "14:00",
            venue: "BIR Central Office",
            description: "Pre-bid conference for IT equipment",
            abc: 12000000,
            category: "IT Equipment"
          },
          {
            id: "2025-03-04",
            projectId: "proj-2025-04",
            title: "IT Equipment Procurement",
            procuringEntity: "Bureau of Internal Revenue",
            eventType: "closing",
            date: "2025-03-28",
            time: "15:00",
            description: "Bid submission deadline for IT equipment",
            abc: 12000000,
            category: "IT Equipment"
          },

          // April 2025
          {
            id: "2025-04-01",
            projectId: "proj-2025-05",
            title: "School Building Construction",
            procuringEntity: "Department of Education - Division of Manila",
            eventType: "publication",
            date: "2025-04-03",
            description: "New elementary school construction project",
            abc: 18000000,
            category: "Construction"
          },
          {
            id: "2025-04-02",
            projectId: "proj-2025-05",
            title: "School Building Construction",
            procuringEntity: "Department of Education - Division of Manila",
            eventType: "prebid",
            date: "2025-04-12",
            time: "09:30",
            venue: "DepEd Division Office",
            description: "Pre-bid conference for school construction",
            abc: 18000000,
            category: "Construction"
          },
          {
            id: "2025-04-03",
            projectId: "proj-2025-05",
            title: "School Building Construction",
            procuringEntity: "Department of Education - Division of Manila",
            eventType: "closing",
            date: "2025-04-22",
            time: "16:30",
            description: "Bid submission deadline for school project",
            abc: 18000000,
            category: "Construction"
          },
          {
            id: "2025-04-04",
            projectId: "proj-2025-06",
            title: "Security Services Procurement",
            procuringEntity: "Land Transportation Office",
            eventType: "publication",
            date: "2025-04-08",
            description: "Security guard services for LTO offices",
            abc: 5600000,
            category: "Services"
          },

          // May 2025
          {
            id: "2025-05-01",
            projectId: "proj-2025-06",
            title: "Security Services Procurement",
            procuringEntity: "Land Transportation Office",
            eventType: "prebid",
            date: "2025-05-02",
            time: "11:00",
            venue: "LTO Central Office",
            description: "Pre-bid conference for security services",
            abc: 5600000,
            category: "Services"
          },
          {
            id: "2025-05-02",
            projectId: "proj-2025-06",
            title: "Security Services Procurement",
            procuringEntity: "Land Transportation Office",
            eventType: "closing",
            date: "2025-05-12",
            time: "17:00",
            description: "Bid submission deadline for security services",
            abc: 5600000,
            category: "Services"
          },
          {
            id: "2025-05-03",
            projectId: "proj-2025-07",
            title: "Water Supply System Upgrade",
            procuringEntity: "Local Water District - Cebu",
            eventType: "publication",
            date: "2025-05-06",
            description: "Water distribution system improvement project",
            abc: 22000000,
            category: "Infrastructure"
          },
          {
            id: "2025-05-04",
            projectId: "proj-2025-07",
            title: "Water Supply System Upgrade",
            procuringEntity: "Local Water District - Cebu",
            eventType: "prebid",
            date: "2025-05-18",
            time: "10:00",
            venue: "MCWD Main Office",
            description: "Pre-bid conference for water system upgrade",
            abc: 22000000,
            category: "Infrastructure"
          },

          // June 2025
          {
            id: "2025-06-01",
            projectId: "proj-2025-07",
            title: "Water Supply System Upgrade",
            procuringEntity: "Local Water District - Cebu",
            eventType: "closing",
            date: "2025-06-02",
            time: "16:00",
            description: "Bid submission deadline for water system project",
            abc: 22000000,
            category: "Infrastructure"
          },
          {
            id: "2025-06-02",
            projectId: "proj-2025-08",
            title: "Laboratory Equipment Supply",
            procuringEntity: "Department of Science and Technology",
            eventType: "publication",
            date: "2025-06-05",
            description: "Scientific laboratory equipment procurement",
            abc: 9500000,
            category: "Scientific Equipment"
          },
          {
            id: "2025-06-03",
            projectId: "proj-2025-08",
            title: "Laboratory Equipment Supply",
            procuringEntity: "Department of Science and Technology",
            eventType: "prebid",
            date: "2025-06-15",
            time: "13:30",
            venue: "DOST Regional Office",
            description: "Pre-bid conference for laboratory equipment",
            abc: 9500000,
            category: "Scientific Equipment"
          },
          {
            id: "2025-06-04",
            projectId: "proj-2025-08",
            title: "Laboratory Equipment Supply",
            procuringEntity: "Department of Science and Technology",
            eventType: "closing",
            date: "2025-06-25",
            time: "15:30",
            description: "Bid submission deadline for laboratory equipment",
            abc: 9500000,
            category: "Scientific Equipment"
          },

          // July 2025
          {
            id: "2025-07-01",
            projectId: "proj-2025-09",
            title: "Bridge Construction Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "publication",
            date: "2025-07-03",
            description: "New bridge construction over major river",
            abc: 45000000,
            category: "Infrastructure"
          },
          {
            id: "2025-07-02",
            projectId: "proj-2025-09",
            title: "Bridge Construction Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "prebid",
            date: "2025-07-12",
            time: "09:00",
            venue: "DPWH Bridge Division",
            description: "Pre-bid conference for bridge construction",
            abc: 45000000,
            category: "Infrastructure"
          },
          {
            id: "2025-07-03",
            projectId: "proj-2025-09",
            title: "Bridge Construction Project",
            procuringEntity: "Department of Public Works and Highways",
            eventType: "closing",
            date: "2025-07-22",
            time: "17:00",
            description: "Bid submission deadline for bridge project",
            abc: 45000000,
            category: "Infrastructure"
          },
          {
            id: "2025-07-04",
            projectId: "proj-2025-10",
            title: "Solar Panel Installation",
            procuringEntity: "Department of Energy",
            eventType: "publication",
            date: "2025-07-08",
            description: "Solar power system installation for government buildings",
            abc: 15000000,
            category: "Renewable Energy"
          },

          // August 2025
          {
            id: "2025-08-01",
            projectId: "proj-2025-10",
            title: "Solar Panel Installation",
            procuringEntity: "Department of Energy",
            eventType: "prebid",
            date: "2025-08-02",
            time: "14:00",
            venue: "DOE Energy Center",
            description: "Pre-bid conference for solar panel installation",
            abc: 15000000,
            category: "Renewable Energy"
          },
          {
            id: "2025-08-02",
            projectId: "proj-2025-10",
            title: "Solar Panel Installation",
            procuringEntity: "Department of Energy",
            eventType: "closing",
            date: "2025-08-12",
            time: "16:00",
            description: "Bid submission deadline for solar project",
            abc: 15000000,
            category: "Renewable Energy"
          },
          {
            id: "2025-08-03",
            projectId: "proj-2025-11",
            title: "Agricultural Equipment Supply",
            procuringEntity: "Department of Agriculture",
            eventType: "publication",
            date: "2025-08-06",
            description: "Farm machinery and equipment procurement",
            abc: 8500000,
            category: "Agricultural Equipment"
          },
          {
            id: "2025-08-04",
            projectId: "proj-2025-11",
            title: "Agricultural Equipment Supply",
            procuringEntity: "Department of Agriculture",
            eventType: "prebid",
            date: "2025-08-18",
            time: "10:30",
            venue: "DA Regional Office",
            description: "Pre-bid conference for agricultural equipment",
            abc: 8500000,
            category: "Agricultural Equipment"
          },

          // September 2025
          {
            id: "2025-09-01",
            projectId: "proj-2025-11",
            title: "Agricultural Equipment Supply",
            procuringEntity: "Department of Agriculture",
            eventType: "closing",
            date: "2025-09-02",
            time: "17:00",
            description: "Bid submission deadline for agricultural equipment",
            abc: 8500000,
            category: "Agricultural Equipment"
          },
          {
            id: "2025-09-02",
            projectId: "proj-2025-12",
            title: "Hospital Renovation Project",
            procuringEntity: "Department of Health",
            eventType: "publication",
            date: "2025-09-05",
            description: "Major hospital renovation and modernization",
            abc: 35000000,
            category: "Construction"
          },
          {
            id: "2025-09-03",
            projectId: "proj-2025-12",
            title: "Hospital Renovation Project",
            procuringEntity: "Department of Health",
            eventType: "prebid",
            date: "2025-09-15",
            time: "09:00",
            venue: "DOH Hospital Administration",
            description: "Pre-bid conference for hospital renovation",
            abc: 35000000,
            category: "Construction"
          },
          {
            id: "2025-09-04",
            projectId: "proj-2025-12",
            title: "Hospital Renovation Project",
            procuringEntity: "Department of Health",
            eventType: "closing",
            date: "2025-09-25",
            time: "16:00",
            description: "Bid submission deadline for hospital project",
            abc: 35000000,
            category: "Construction"
          },

          // October 2025
          {
            id: "2025-10-01",
            projectId: "proj-2025-13",
            title: "Telecommunications Infrastructure",
            procuringEntity: "Department of Information and Communications Technology",
            eventType: "publication",
            date: "2025-10-03",
            description: "Government telecommunications network upgrade",
            abc: 28000000,
            category: "Telecommunications"
          },
          {
            id: "2025-10-02",
            projectId: "proj-2025-13",
            title: "Telecommunications Infrastructure",
            procuringEntity: "Department of Information and Communications Technology",
            eventType: "prebid",
            date: "2025-10-12",
            time: "13:00",
            venue: "DICT Main Office",
            description: "Pre-bid conference for telecom infrastructure",
            abc: 28000000,
            category: "Telecommunications"
          },
          {
            id: "2025-10-03",
            projectId: "proj-2025-13",
            title: "Telecommunications Infrastructure",
            procuringEntity: "Department of Information and Communications Technology",
            eventType: "closing",
            date: "2025-10-22",
            time: "15:00",
            description: "Bid submission deadline for telecom project",
            abc: 28000000,
            category: "Telecommunications"
          },
          {
            id: "2025-10-04",
            projectId: "proj-2025-14",
            title: "Waste Management Equipment",
            procuringEntity: "Department of Environment and Natural Resources",
            eventType: "publication",
            date: "2025-10-08",
            description: "Solid waste management equipment procurement",
            abc: 12000000,
            category: "Environmental Equipment"
          },

          // November 2025
          {
            id: "2025-11-01",
            projectId: "proj-2025-14",
            title: "Waste Management Equipment",
            procuringEntity: "Department of Environment and Natural Resources",
            eventType: "prebid",
            date: "2025-11-02",
            time: "11:00",
            venue: "DENR Environmental Center",
            description: "Pre-bid conference for waste management equipment",
            abc: 12000000,
            category: "Environmental Equipment"
          },
          {
            id: "2025-11-02",
            projectId: "proj-2025-14",
            title: "Waste Management Equipment",
            procuringEntity: "Department of Environment and Natural Resources",
            eventType: "closing",
            date: "2025-11-12",
            time: "17:00",
            description: "Bid submission deadline for waste management equipment",
            abc: 12000000,
            category: "Environmental Equipment"
          },
          {
            id: "2025-11-03",
            projectId: "proj-2025-15",
            title: "Airport Terminal Expansion",
            procuringEntity: "Department of Transportation",
            eventType: "publication",
            date: "2025-11-06",
            description: "Major airport terminal expansion project",
            abc: 75000000,
            category: "Infrastructure"
          },
          {
            id: "2025-11-04",
            projectId: "proj-2025-15",
            title: "Airport Terminal Expansion",
            procuringEntity: "Department of Transportation",
            eventType: "prebid",
            date: "2025-11-18",
            time: "10:00",
            venue: "DOT Airport Authority",
            description: "Pre-bid conference for airport expansion",
            abc: 75000000,
            category: "Infrastructure"
          },

          // December 2025
          {
            id: "2025-12-01",
            projectId: "proj-2025-15",
            title: "Airport Terminal Expansion",
            procuringEntity: "Department of Transportation",
            eventType: "closing",
            date: "2025-12-02",
            time: "16:00",
            description: "Bid submission deadline for airport project",
            abc: 75000000,
            category: "Infrastructure"
          },
          {
            id: "2025-12-02",
            projectId: "proj-2025-16",
            title: "Educational Software Development",
            procuringEntity: "Department of Education",
            eventType: "publication",
            date: "2025-12-05",
            description: "E-learning platform and educational software",
            abc: 18000000,
            category: "Software Development"
          },
          {
            id: "2025-12-03",
            projectId: "proj-2025-16",
            title: "Educational Software Development",
            procuringEntity: "Department of Education",
            eventType: "prebid",
            date: "2025-12-15",
            time: "14:00",
            venue: "DepEd ICT Center",
            description: "Pre-bid conference for educational software",
            abc: 18000000,
            category: "Software Development"
          },
          {
            id: "2025-12-04",
            projectId: "proj-2025-16",
            title: "Educational Software Development",
            procuringEntity: "Department of Education",
            eventType: "closing",
            date: "2025-12-28",
            time: "15:30",
            description: "Bid submission deadline for educational software",
            abc: 18000000,
            category: "Software Development"
          }
        ]
        
        setEvents(mockEvents)
      } catch (error) {
        console.error('Error fetching calendar events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events based on search and type filter
  useEffect(() => {
    let filtered = events

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.procuringEntity.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.category?.toLowerCase().includes(term)
      )
    }

    // Apply event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(event => event.eventType === eventTypeFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, eventTypeFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'publication':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'prebid':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'closing':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'deadline':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'publication':
        return 'Published'
      case 'prebid':
        return 'Pre-bid Conference'
      case 'closing':
        return 'Bid Closing'
      case 'deadline':
        return 'Deadline'
      default:
        return 'Event'
    }
  }

  // Calendar generation
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getEventsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEvents.filter(event => event.date === dateString)
  }

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return []
    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    return filteredEvents.filter(event => event.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(month - 1)
    } else {
      newDate.setMonth(month + 1)
    }
    setCurrentDate(newDate)
  }

  if (isLoading) {
    return <LoadingScreen message="Loading calendar..." size={100} />
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
              <BreadcrumbPage>Calendar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border-b">
          <div className="px-4 lg:px-6 py-8 md:py-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Project Calendar</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    Stay on top of all your PhilGEPS project deadlines and events
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Track publication dates, pre-bid conferences, bid closing deadlines, and other important milestones for your procurement projects.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="publication">Publications</SelectItem>
                  <SelectItem value="prebid">Pre-bid Conferences</SelectItem>
                  <SelectItem value="closing">Bid Closings</SelectItem>
                  <SelectItem value="deadline">Deadlines</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          {viewMode === "calendar" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-xl">{monthNames[month]} {year}</CardTitle>
                      <CardDescription>
                        {filteredEvents.filter(event => {
                          const eventDate = new Date(event.date)
                          return eventDate.getMonth() === month && eventDate.getFullYear() === year
                        }).length} events this month
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-3">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (day === null) {
                          return <div key={index} className="h-20"></div>
                        }

                        const dayEvents = getEventsForDate(day)
                        const isSelected = selectedDate &&
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === month &&
                          selectedDate.getFullYear() === year
                        const isToday = new Date().getDate() === day &&
                          new Date().getMonth() === month &&
                          new Date().getFullYear() === year

                        return (
                          <div
                            key={day}
                            className={`h-20 p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                              isSelected ? 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600' :
                              isToday ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-700' :
                              'border-border hover:border-slate-300'
                            }`}
                            onClick={() => setSelectedDate(new Date(year, month, day))}
                          >
                            <div className={`text-sm font-medium mb-2 ${isToday ? 'text-slate-600 dark:text-slate-400' : ''}`}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map(event => (
                                <div
                                  key={event.id}
                                  className={`text-xs px-1.5 py-0.5 rounded-full text-center font-medium border ${getEventTypeColor(event.eventType)}`}
                                >
                                  {event.eventType === 'prebid' ? 'Pre-bid' :
                                   event.eventType === 'closing' ? 'Closing' :
                                   event.eventType === 'publication' ? 'Published' : 'Event'}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-muted-foreground text-center font-medium">
                                  +{dayEvents.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

          {/* Sidebar - Selected Date Events or Upcoming Events */}
          <div>
            {selectedDate ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString('en-PH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <CardDescription>
                    {getEventsForSelectedDate().length} event{getEventsForSelectedDate().length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getEventsForSelectedDate().map(event => (
                      <div key={event.id} className="border-l-4 border-primary pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className={getEventTypeColor(event.eventType)}>
                              {getEventTypeLabel(event.eventType)}
                            </Badge>
                            <h4 className="font-medium mt-2 mb-1">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.procuringEntity}
                            </p>
                            {event.time && (
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {event.time}
                              </div>
                            )}
                            {event.venue && (
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.venue}
                              </div>
                            )}
                            {event.abc && (
                              <div className="text-sm font-medium text-green-600">
                                {formatCurrency(event.abc)}
                              </div>
                            )}
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {getEventsForSelectedDate().length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No events scheduled for this date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <CardDescription>
                    Next important dates in your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 5).map(event => (
                      <div key={event.id} className="border-l-4 border-primary pl-4">
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        <h4 className="font-medium mt-2 mb-1">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.procuringEntity}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString('en-PH')}
                          {event.time && ` at ${event.time}`}
                        </div>
                        {event.abc && (
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(event.abc)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
          ) : (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Event List View</CardTitle>
                <CardDescription>All scheduled events in chronological order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <div key={event.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.eventType).split(' ')[0]}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {event.eventType === 'prebid' ? 'Pre-bid' :
                             event.eventType === 'closing' ? 'Closing' :
                             event.eventType === 'publication' ? 'Published' : 'Event'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No events found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => {
                  const eventDate = new Date(event.date)
                  return eventDate.getMonth() === month && eventDate.getFullYear() === year
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Events scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pre-bid Conferences</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => event.eventType === 'prebid').length}
              </div>
              <p className="text-xs text-muted-foreground">Upcoming meetings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closing Deadlines</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => event.eventType === 'closing').length}
              </div>
              <p className="text-xs text-muted-foreground">Bid submissions due</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Publications</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => event.eventType === 'publication').length}
              </div>
              <p className="text-xs text-muted-foreground">Recently published</p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  )
}