"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  MapPin
} from "lucide-react"

interface Project {
  id: string
  title?: string | null
  publishAt?: Date | null
  closingAt?: Date | null
  parsedClosingAt?: Date | null
  datePublished?: Date | null
  lastUpdatedAt?: Date | null
  prebidFirstDate?: Date | null
  prebidFirstTime?: string | null
  prebidFirstVenue?: string | null
  deadline?: string
  updatedAt?: string
  timeline?: Array<{
    date: string
    event: string
    status: string
  }>
}

interface TimelineTabProps {
  project: Project
}

export function TimelineTab({ project }: TimelineTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No project data available</p>
      </div>
    )
  }

  const getTimelineEvents = () => {
    const events: Array<{
      date: Date | null
      title: string
      description: string
      status: 'completed' | 'upcoming' | 'pending' | 'in-progress'
      type: 'milestone' | 'deadline' | 'meeting' | 'activity'
    }> = []

    // Use actual project timeline data if available
    if (project.timeline && project.timeline.length > 0) {
      project.timeline.forEach((timelineEvent) => {
        const eventDate = new Date(timelineEvent.date)
        let eventType: 'milestone' | 'deadline' | 'meeting' | 'activity' = 'activity'
        let description = timelineEvent.event

        // Determine event type based on event content
        if (timelineEvent.event.toLowerCase().includes('deadline') || timelineEvent.event.toLowerCase().includes('submission')) {
          eventType = 'deadline'
        } else if (timelineEvent.event.toLowerCase().includes('conference') || timelineEvent.event.toLowerCase().includes('meeting')) {
          eventType = 'meeting'
        } else if (timelineEvent.event.toLowerCase().includes('award') || timelineEvent.event.toLowerCase().includes('signing')) {
          eventType = 'milestone'
        }

        // Map status to correct format
        let status: 'completed' | 'upcoming' | 'pending' | 'in-progress' = 'pending'
        switch (timelineEvent.status) {
          case 'completed':
            status = 'completed'
            break
          case 'in-progress':
            status = 'in-progress'
            break
          case 'upcoming':
            status = 'upcoming'
            break
          default:
            status = 'pending'
        }

        events.push({
          date: eventDate,
          title: timelineEvent.event,
          description: description,
          status: status,
          type: eventType
        })
      })
    } else {
      // Fallback dummy data if no timeline is available
      events.push(
        {
          date: new Date(2025, 8, 10), // September 10, 2025
          title: "Project Published",
          description: "Project posting made available on PhilGEPS portal",
          status: 'completed',
          type: 'milestone'
        },
        {
          date: new Date(2025, 8, 18), // September 18, 2025
          title: "Pre-bid Conference",
          description: "Mandatory pre-bid conference at PhilGEPS Conference Room",
          status: 'completed',
          type: 'meeting'
        },
        {
          date: new Date(2025, 8, 25), // September 25, 2025
          title: "Submission Deadline",
          description: "Final deadline for bid submission and all requirements",
          status: 'upcoming',
          type: 'deadline'
        }
      )
    }

    // Sort events by date
    return events.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return a.date.getTime() - b.date.getTime()
    })
  }

  const getStatusBadge = (status: 'completed' | 'upcoming' | 'pending' | 'in-progress') => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'upcoming':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Upcoming</Badge>
      case 'pending':
        return <Badge variant="outline"><Circle className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline"><Circle className="h-3 w-3 mr-1" />Unknown</Badge>
    }
  }

  const timelineEvents = getTimelineEvents()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Create event dates for calendar highlighting
  const eventDates = timelineEvents
    .filter(event => event.date)
    .map(event => new Date(event.date!))

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return timelineEvents.filter(event => {
      if (!event.date) return false
      const eventDate = new Date(event.date)
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Project Timeline
          </CardTitle>
          <CardDescription>
            Important dates and milestones are highlighted on the calendar
          </CardDescription>
        </CardHeader>
      </Card>

  {/* Calendar + Timeline Grid (responsive) */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 min-h-[600px]">

       {/* Calendar */}
    <div className="col-span-1 md:col-span-2">
      <Card className="h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full border-0 shadow-none bg-background flex-1"
            classNames={{
              months: "w-full h-full flex flex-col",
              month: "w-full h-full flex flex-col",
              caption: "flex justify-center py-4 relative items-center flex-shrink-0",
              caption_label: "text-lg font-semibold",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-muted rounded-md",
              nav_button_previous: "absolute left-4",
              nav_button_next: "absolute right-4",
              table: "w-full h-full flex flex-col flex-1",
              head_row: "grid grid-cols-7 w-full flex-shrink-0",
              head_cell: "text-xs text-muted-foreground rounded-md w-full font-normal text-center p-2 border border-border/20",
              row: "grid grid-cols-7 w-full flex-1",
              cell: "text-center p-0 relative border border-border/20 rounded-sm h-full w-full",
              day: "h-full w-full p-2 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors text-sm flex items-center justify-center",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            modifiers={{ event: eventDates, today: new Date() }}
            modifiersStyles={{
              event: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontWeight: "bold",
                position: "relative",
              },
            }}
            modifiersClassNames={{
              event: "relative bg-primary text-primary-foreground font-bold after:content-[''] after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-orange-500 after:rounded-full after:border after:border-white",
            }}
          />
        </CardContent>
      </Card>
    </div>

    {/* Timeline */}
    <div className="col-span-1 md:col-span-3">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            {selectedDate ? `Events for ${formatDate(selectedDate)}` : "Timeline Events"}
          </CardTitle>
          <CardDescription>
            {selectedDate
              ? `${selectedDateEvents.length} event${selectedDateEvents.length !== 1 ? "s" : ""} on this date`
              : "Select a date on the calendar to view events"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {selectedDate ? (
            selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(event.status)}</div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>

                      {event.type === "meeting" && (
                        <div className="space-y-1">
                          {project.prebidFirstTime && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {project.prebidFirstTime}
                            </div>
                          )}
                          {project.prebidFirstVenue && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {project.prebidFirstVenue}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {getStatusBadge(event.status)}
                        <div className="text-xs text-muted-foreground">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-sm mb-2">No Events</h3>
                <p className="text-xs text-muted-foreground">
                  No events scheduled for this date.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-2">Select a Date</h3>
              <p className="text-xs text-muted-foreground">
                Click on a date in the calendar to view events for that day.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>

    </div>
  )
}