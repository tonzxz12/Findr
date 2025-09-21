"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  MapPin,
  Edit,
  Share2,
  ExternalLink,
  Brain,
  Shield
} from "lucide-react"

interface Project {
  id: string
  title?: string | null
  referenceNumber?: string | null
  procuringEntity?: string | null
  philgepsTitle?: string | null
  areaOfDelivery?: string | null
  solicitationNumber?: string | null
  tradeAgreement?: string | null
  procurementMode?: string | null
  classification?: string | null
  category?: string | null
  abc?: string | null
  deliveryPeriod?: string | null
  description?: string | null
  publishAt?: Date | null
  closingAt?: Date | null
  parsedClosingAt?: Date | null
  datePublished?: Date | null
  lastUpdatedAt?: Date | null
  budgetAbc?: string
  deadline?: string
  updatedAt?: string
  // Additional fields from project data
  procurementSummary?: string
  keyRequirements?: string
  fundSource?: string
  deliveryTerms?: string
  paymentTerms?: string
  aiConfidenceScore?: number
  processingMethod?: string
  url?: string
  status?: string
  projectDuration?: string
  bidOpeningDate?: string
}

interface OverviewTabProps {
  project: Project
}

export function OverviewTab({ project }: OverviewTabProps) {
  const formatCurrency = (amount: string | null) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(parseFloat(amount))
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified'
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getStatus = () => {
    const closingDate = project?.closingAt || (project?.deadline ? new Date(project.deadline) : null)
    if (!closingDate) return 'Unknown'
    return new Date(closingDate) > new Date() ? 'Open for Bidding' : 'Closed'
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
      {/* Project Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Project Status</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on PhilGEPS
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Current Status</span>
              <Badge variant="outline" className="bg-muted">
                {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : getStatus()}
              </Badge>
            </div>
            {(project.closingAt || project.deadline) && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Deadline</span>
                <div className="text-sm font-medium">{formatDate(project.closingAt || (project.deadline ? new Date(project.deadline) : null))}</div>
              </div>
            )}
            {project.bidOpeningDate && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Bid Opening</span>
                <div className="text-sm font-medium">{project.bidOpeningDate}</div>
              </div>
            )}
            {(project.lastUpdatedAt || project.updatedAt) && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                <div className="text-sm font-medium">
                  {formatDate(
                    project.lastUpdatedAt || 
                    (project.updatedAt ? new Date(project.updatedAt) : null)
                  )}
                </div>
              </div>
            )}
          </div>
          {project.url && (
            <div className="pt-2">
              <Button variant="link" className="p-0 h-auto text-sm" asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Original PhilGEPS Posting
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">Title</span>
                <span className="text-sm text-right max-w-xs">{project.title || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Reference Number</span>
                <span className="text-sm font-medium">{project.referenceNumber || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Solicitation Number</span>
                <span className="text-sm font-medium">{project.solicitationNumber || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Classification</span>
                <Badge variant="secondary">{project.classification || 'Not specified'}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Category</span>
                <span className="text-sm">{project.category || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial & Delivery Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              Financial & Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Approved Budget for Contract (ABC)</span>
                <span className="text-sm font-bold">{formatCurrency(project.abc || project.budgetAbc || null)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Procurement Mode</span>
                <span className="text-sm">{project.procurementMode || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Delivery Period</span>
                <span className="text-sm">{project.deliveryPeriod || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Fund Source</span>
                <span className="text-sm">{project.fundSource || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Delivery Terms</span>
                <span className="text-sm">{project.deliveryTerms || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Payment Terms</span>
                <span className="text-sm">{project.paymentTerms || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Project Duration</span>
                <span className="text-sm">{project.projectDuration || project.deliveryPeriod || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procuring Entity & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Procuring Entity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">Organization</span>
                <span className="text-sm text-right max-w-xs">{project.procuringEntity || 'Not specified'}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">Area of Delivery</span>
                <span className="text-sm text-right max-w-xs">{project.areaOfDelivery || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {project.publishAt && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Published</span>
                    <span className="text-sm">{formatDate(project.publishAt)}</span>
                  </div>
                  <Separator />
                </>
              )}
              {project.datePublished && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Date Published</span>
                    <span className="text-sm">{formatDate(project.datePublished)}</span>
                  </div>
                  <Separator />
                </>
              )}
              {project.closingAt && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Closing Date</span>
                    <span className="text-sm font-medium">{formatDate(project.closingAt)}</span>
                  </div>
                  <Separator />
                </>
              )}
              {project.parsedClosingAt && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Parsed Closing Date</span>
                  <span className="text-sm">{formatDate(project.parsedClosingAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Processing Information */}
      {(project.aiConfidenceScore || project.processingMethod) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              AI Processing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.aiConfidenceScore && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">AI Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.aiConfidenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{project.aiConfidenceScore}%</span>
                  </div>
                </div>
              )}
              {project.processingMethod && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Processing Method</span>
                  <Badge variant="secondary">{project.processingMethod}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procurement Summary */}
      {project.procurementSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Procurement Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.procurementSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Requirements */}
      {project.keyRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Key Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed">
                {project.keyRequirements}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Project Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}