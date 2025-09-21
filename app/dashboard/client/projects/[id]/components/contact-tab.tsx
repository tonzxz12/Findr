"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, MapPin, Clock, Building, AlertCircle, Map, Navigation, ExternalLink, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title?: string | null
  procuringEntity?: string | null
  procuringEntityDetails?: {
    contactPerson?: string
    email?: string
    phone?: string
    address?: string
  }
  areaOfDelivery?: string | null
  prebidFirstVenue?: string | null
  prebidFirstDate?: Date | null
  prebidFirstTime?: string | null
  contacts?: any[] | null
  latitude?: number | null
  longitude?: number | null
}

interface ContactTabProps {
  project: Project
}

export function ContactTab({ project }: ContactTabProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  // Get the primary contact address for map display
  const getPrimaryAddress = () => {
    if (project.contacts && project.contacts.length > 0) {
      const primaryContact = project.contacts[0]
      if (primaryContact.address) {
        return primaryContact.address
      }
    }
    return project.areaOfDelivery || "Project Location"
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No project data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Procuring Entity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            Procuring Entity
          </CardTitle>
          <CardDescription>
            Organization responsible for this procurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.procuringEntity ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Organization</p>
                  <p className="text-sm text-muted-foreground">{project.procuringEntity}</p>
                </div>
              </div>
              
              {project.areaOfDelivery && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Area of Delivery</p>
                      <p className="text-sm text-muted-foreground">{project.areaOfDelivery}</p>
                    </div>
                  </div>
                </>
              )}

              {project.procuringEntityDetails && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Procuring Entity Contact</h4>
                    <div className="grid grid-cols-1 gap-3 pl-8">
                      {project.procuringEntityDetails.contactPerson && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{project.procuringEntityDetails.contactPerson}</span>
                        </div>
                      )}
                      {project.procuringEntityDetails.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📧</span>
                          <a href={`mailto:${project.procuringEntityDetails.email}`} className="text-sm text-blue-600 hover:underline">
                            {project.procuringEntityDetails.email}
                          </a>
                        </div>
                      )}
                      {project.procuringEntityDetails.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📞</span>
                          <a href={`tel:${project.procuringEntityDetails.phone}`} className="text-sm text-blue-600 hover:underline">
                            {project.procuringEntityDetails.phone}
                          </a>
                        </div>
                      )}
                      {project.procuringEntityDetails.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{project.procuringEntityDetails.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No procuring entity information available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pre-bid Conference Information */}
      {(project.prebidFirstDate || project.prebidFirstVenue || project.prebidFirstTime) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Pre-bid Conference
            </CardTitle>
            <CardDescription>
              Mandatory pre-bid conference details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.prebidFirstDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(project.prebidFirstDate)}</p>
                  </div>
                </div>
              )}
              {project.prebidFirstTime && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Time</p>
                    <p className="text-sm text-muted-foreground">{project.prebidFirstTime}</p>
                  </div>
                </div>
              )}
            </div>
            {project.prebidFirstVenue && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Venue</p>
                  <p className="text-sm text-muted-foreground">{project.prebidFirstVenue}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Location & Map */}
      {(project.areaOfDelivery || project.procuringEntity) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-muted-foreground" />
              Location & Map
            </CardTitle>
            <CardDescription>
              Geographic location and interactive map
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.areaOfDelivery && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Area of Delivery</p>
                    <p className="text-sm text-muted-foreground">{project.areaOfDelivery}</p>
                  </div>
                </div>
              )}
              
              {project.procuringEntity && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Procuring Entity</p>
                    <p className="text-sm text-muted-foreground">{project.procuringEntity}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Embedded Google Maps */}
            <div className="relative">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${project.latitude || 14.5995},${project.longitude || 120.9842}&z=16&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded"
                />
              </div>

              {/* Map Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" disabled className="text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(`https://maps.google.com/?q=${project.latitude || 14.5995},${project.longitude || 120.9842}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open in Maps
                  </Button>
                  <Button variant="outline" size="sm" disabled className="text-xs">
                    🗺️ Full Screen
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Embedded Google Maps
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{project.latitude ? project.latitude.toFixed(4) : '14.5995'}°</div>
                <div className="text-xs text-muted-foreground">Latitude</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{project.longitude ? project.longitude.toFixed(4) : '120.9842'}°</div>
                <div className="text-xs text-muted-foreground">Longitude</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">🇵🇭</div>
                <div className="text-xs text-muted-foreground">Philippines</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Maps Features */}
      {project.contacts && project.contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Contact Persons
            </CardTitle>
            <CardDescription>
              Designated contact persons for this procurement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.contacts.map((contact: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    {contact.name && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="text-sm">{contact.name}</p>
                      </div>
                    )}
                    {contact.position && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p className="text-sm">{contact.position}</p>
                      </div>
                    )}
                    {contact.department && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="text-sm">{contact.department}</p>
                      </div>
                    )}
                    {contact.phone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="text-sm">{contact.phone}</p>
                      </div>
                    )}
                    {contact.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{contact.email}</p>
                      </div>
                    )}
                    {contact.address && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-sm">{contact.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            Contact Information
          </CardTitle>
          <CardDescription>
            General contact details for this procurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.procuringEntity ? (
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-sm text-muted-foreground mb-1">Procuring Entity</p>
              <p className="font-medium">{project.procuringEntity}</p>
              {project.areaOfDelivery && (
                <p className="text-sm text-muted-foreground mt-2">
                  📍 {project.areaOfDelivery}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No contact information available for this project
              </p>
            </div>
          )}
          
          {(!project.contacts || project.contacts.length === 0) && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No specific contact persons listed. Please contact the procuring entity directly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Contact information and location data are sourced from PhilGEPS.
          The embedded Google Maps shows the approximate location based on the area of delivery and contact addresses.
          For the most current contact details and specific inquiries, please refer to the official PhilGEPS posting or contact the designated contact persons directly.
        </AlertDescription>
      </Alert>
    </div>
  )
}