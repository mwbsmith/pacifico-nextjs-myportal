"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime?: string
  location?: string
  type: "academic" | "festival" | "meeting" | "holiday" | "other"
  attendees?: string[]
}

interface CalendarDay {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function CalendarSection() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "list">("month")

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await fetch(`/api/calendar/events?year=${year}&month=${month}`)

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      setError("Unable to load calendar events. Please try again later.")
      // Fallback to mock data
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === date.toDateString()
      })

      days.push({
        date,
        events: dayEvents,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "academic":
        return "bg-primary text-primary-foreground"
      case "festival":
        return "bg-secondary text-secondary-foreground"
      case "meeting":
        return "bg-accent text-accent-foreground"
      case "holiday":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">School Calendar</h2>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">School Calendar</h2>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>
            Month
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchEvents} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "month" ? (
                <div className="space-y-4">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getCalendarDays().map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border rounded-lg ${
                          day.isCurrentMonth ? "bg-background" : "bg-muted/30"
                        } ${day.isToday ? "ring-2 ring-primary" : ""}`}
                      >
                        <div
                          className={`text-sm font-medium mb-1 ${
                            day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {day.date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {day.events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded cursor-pointer truncate ${getEventTypeColor(event.type)}`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              {event.title}
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{day.events.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {events
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </div>
                          <div className="text-2xl font-bold">{new Date(event.date).getDate()}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-balance">{event.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.type)}>{selectedEvent.type}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEvent.startTime}
                    {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.attendees.join(", ")}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock events data
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Parent-Teacher Conferences",
    description: "Individual meetings with teachers to discuss student progress",
    date: "2024-12-20",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    location: "Main Building",
    type: "meeting",
    attendees: ["Parents", "Teachers"],
  },
  {
    id: "2",
    title: "Winter Festival",
    description: "Annual winter celebration with performances and crafts",
    date: "2024-12-22",
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    location: "School Auditorium",
    type: "festival",
    attendees: ["All Families"],
  },
  {
    id: "3",
    title: "Winter Break",
    description: "School closed for winter holidays",
    date: "2024-12-23",
    startTime: "All Day",
    type: "holiday",
  },
  {
    id: "4",
    title: "New Year's Day",
    description: "School closed for New Year's Day",
    date: "2025-01-01",
    startTime: "All Day",
    type: "holiday",
  },
  {
    id: "5",
    title: "Classes Resume",
    description: "First day back from winter break",
    date: "2025-01-06",
    startTime: "8:00 AM",
    location: "All Classrooms",
    type: "academic",
  },
  {
    id: "6",
    title: "Grade 8 Graduation Planning",
    description: "Meeting to plan eighth grade graduation ceremony",
    date: "2025-01-15",
    startTime: "7:00 PM",
    endTime: "8:30 PM",
    location: "Conference Room",
    type: "meeting",
    attendees: ["Grade 8 Parents", "Teachers"],
  },
]
