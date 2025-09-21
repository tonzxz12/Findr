"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2
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

// Types based on your schema
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
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Simulated data based on your schema
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with real API call to your database
        // Query projects and extract date events from publishAt, closingAt, prebidFirstDate
        
        const mockEvents: ProjectEvent[] = [
          {
            id: "1",
            projectId: "proj-1",
            title: "Construction of New Municipal Building",
            procuringEntity: "City Government of Manila",
            eventType: "publication",
            date: "2024-01-15",
            description: "Project published on PhilGEPS",
            abc: 15000000,
            category: "Construction"
          },
          {
            id: "2",
            projectId: "proj-1", 
            title: "Construction of New Municipal Building",
            procuringEntity: "City Government of Manila",
            eventType: "prebid",
            date: "2024-01-25",
            time: "10:00",
            venue: "Manila City Hall",
            description: "Pre-bid conference for interested bidders",
            abc: 15000000,
            category: "Construction"
          },
          {
            id: "3",
            projectId: "proj-1",
            title: "Construction of New Municipal Building", 
            procuringEntity: "City Government of Manila",
            eventType: "closing",
            date: "2024-02-15",
            time: "17:00",
            description: "Bid submission deadline",
            abc: 15000000,
            category: "Construction"
          },
          {
            id: "4",
            projectId: "proj-2",
            title: "Supply of Office Equipment",
            procuringEntity: "Department of Education",
            eventType: "publication",
            date: "2024-01-20",
            description: "Project published on PhilGEPS",
            abc: 2500000,
            category: "Supplies"
          },
          {
            id: "5",
            projectId: "proj-2",
            title: "Supply of Office Equipment",
            procuringEntity: "Department of Education", 
            eventType: "prebid",
            date: "2024-01-30",
            time: "14:00",
            venue: "DepEd Central Office",
            description: "Pre-bid conference for suppliers",
            abc: 2500000,
            category: "Supplies"
          },
          {
            id: "6",
            projectId: "proj-2",
            title: "Supply of Office Equipment",
            procuringEntity: "Department of Education",
            eventType: "closing", 
            date: "2024-02-20",
            time: "17:00",
            description: "Bid submission deadline",
            abc: 2500000,
            category: "Supplies"
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
        return 'bg-blue-100 text-blue-800'
      case 'prebid':
        return 'bg-yellow-100 text-yellow-800'
      case 'closing':
        return 'bg-red-100 text-red-800'
      case 'deadline':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    return events.filter(event => event.date === dateString)
  }

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return []
    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    return events.filter(event => event.date === dateString)
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

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Track important dates for your PhilGEPS projects
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">
                  {monthNames[month]} {year}
                </CardTitle>
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
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="h-16"></div>
                    }
                    
                    const dayEvents = getEventsForDate(day)
                    const isSelected = selectedDate && 
                      selectedDate.getDate() === day && 
                      selectedDate.getMonth() === month &&
                      selectedDate.getFullYear() === year
                    
                    return (
                      <div 
                        key={day}
                        className={`h-16 p-1 border rounded cursor-pointer hover:bg-muted transition-colors ${
                          isSelected ? 'bg-primary/10 border-primary' : 'border-border'
                        }`}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                      >
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded text-center ${getEventTypeColor(event.eventType)}`}
                            >
                              {event.eventType === 'prebid' ? 'Pre-bid' : 
                               event.eventType === 'closing' ? 'Closing' :
                               event.eventType === 'publication' ? 'Published' : 'Event'}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayEvents.length - 2} more
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
    </>
  )
}