"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  FileText, 
  Download, 
  Eye, 
  AlertCircle, 
  File, 
  FileImage, 
  FileSpreadsheet,
  ExternalLink,
  Clock,
  FolderOpen
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectAttachment {
  id: string
  filename: string | null
  fileUrl: string | null
  mimeType: string | null
  sizeBytes: number | null
  metadata: any
  uploadedAt: Date | null
}

interface Project {
  id: string
  title?: string | null
  attachments?: ProjectAttachment[]
  documents?: Array<{
    name: string
    type: string
    size: string
    downloadUrl: string
  }>
  // Additional context fields
  procurementSummary?: string
  keyRequirements?: string
  budgetAbc?: string
  procurementMode?: string
  classification?: string
}

interface DocumentsTabProps {
  project: Project
  attachments?: ProjectAttachment[]
}

export function DocumentsTab({ project, attachments = [] }: DocumentsTabProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown date'
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getFileTypeFromMimeType = (mimeType: string | null) => {
    if (!mimeType) return 'FILE'
    
    const mimeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'text/plain': 'TXT',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'application/zip': 'ZIP'
    }
    
    return mimeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE'
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="h-6 w-6 text-purple-500" />
      case 'dwg':
        return <File className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getDocumentPreview = (document: any) => {
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(document.type?.toLowerCase())
    const isPdf = document.type?.toLowerCase() === 'pdf'
    const isWord = ['doc', 'docx'].includes(document.type?.toLowerCase())
    const isExcel = ['xls', 'xlsx'].includes(document.type?.toLowerCase())
    
    // Convert Google Drive view link to embed link
    const getEmbedUrl = (url: string) => {
      if (url.includes('drive.google.com/file/d/')) {
        const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
        if (fileIdMatch) {
          // Convert any Google Drive view URL to preview format for iframe embedding
          return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
        }
      }
      return url
    }
    
    // Handle Google Drive documents
    if (document.downloadUrl.includes('drive.google.com')) {
      const embedUrl = getEmbedUrl(document.downloadUrl)
      console.log('Original URL:', document.downloadUrl)
      console.log('Converted embed URL:', embedUrl)
      
      return (
        <div className="w-full h-[600px] bg-white rounded-lg border-2 border-gray-200 shadow-lg">
          <iframe 
            src={embedUrl}
            className="w-full h-full rounded-lg"
            title={document.name}
            allow="autoplay"
            allowFullScreen
            loading="lazy"
            style={{ border: 'none' }}
            onLoad={() => console.log('Iframe loaded successfully')}
            onError={() => console.log('Iframe failed to load')}
          />
        </div>
      )
    }
    
    if (isImage && document.downloadUrl !== '#') {
      return (
        <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
          <img 
            src={document.downloadUrl} 
            alt={document.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )
    }
    
    if (isPdf && document.downloadUrl !== '#') {
      return (
        <div className="w-full h-[600px] bg-white rounded-lg border-2 border-gray-200 shadow-lg">
          <iframe 
            src={`${document.downloadUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full rounded-lg"
            title={document.name}
          />
        </div>
      )
    }
    
    return (
      <div className="w-full h-96 bg-white rounded-lg border-2 border-gray-200 shadow-lg flex flex-col items-center justify-center">
        {getFileIcon(document.type)}
        <p className="mt-4 text-sm text-muted-foreground">Preview not available</p>
        <p className="text-xs text-muted-foreground">Click "Open in New Tab" to view the file</p>
        {document.downloadUrl.includes('drive.google.com') && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              Google Drive document detected. Use "Open in New Tab" for best experience.
            </p>
          </div>
        )}
      </div>
    )
  }

  const getBondPaperPreview = (document: any) => {
    const isPdf = document.type?.toLowerCase() === 'pdf'
    
    // Convert Google Drive view link to embed link for preview
    const getEmbedUrl = (url: string) => {
      if (url.includes('drive.google.com/file/d/')) {
        const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
        if (fileIdMatch) {
          return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
        }
      }
      return url
    }
    
    const hasValidUrl = document.downloadUrl && document.downloadUrl !== '#'
    const isGoogleDrive = hasValidUrl && document.downloadUrl.includes('drive.google.com')
    
    return (
      <div className="relative w-full space-y-3">
        {/* File info header - outside/above the paper container */}
        <div className="flex items-center gap-3 p-3 bg-white border rounded-md border-gray-300">
          <div className="flex-shrink-0 p-2 bg-gray-100 border rounded-md border-gray-200">
            <FileText className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-800 truncate mb-1 leading-tight">
              {document.name}
            </h4>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                {document.type}
              </Badge>
              <span className="text-xs text-gray-600 font-medium">
                {document.size}
              </span>
            </div>
          </div>
        </div>

        {/* Bond paper container */}
        <div className="relative w-full h-[380px] bg-white shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]">
          {/* A4 Paper background with realistic texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20" />
          
          {/* Paper texture with subtle grain */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_#64748b_1px,_transparent_0)] bg-[length:24px_24px]" />
          
          {/* Ruled lines like real paper */}
          <div className="absolute inset-0 opacity-15">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="w-full h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" 
                style={{ marginTop: i === 0 ? '40px' : '20px' }}
              />
            ))}
          </div>
          
          {/* Left margin line (red line) */}
          <div className="absolute left-12 top-0 bottom-0 w-px bg-red-300/40 opacity-60" />
          
          {/* Three-hole punch marks */}
          <div className="absolute left-3 top-12 w-2 h-2 bg-gray-300/30 rounded-full" />
          <div className="absolute left-3 top-1/2 w-2 h-2 bg-gray-300/30 rounded-full transform -translate-y-1/2" />
          <div className="absolute left-3 bottom-12 w-2 h-2 bg-gray-300/30 rounded-full" />
          
          {/* Document content preview area */}
          <div className="relative p-4 h-full">
            <div className="w-full h-full relative overflow-hidden bg-white/80 border border-gray-200/50 shadow-inner">
              {isGoogleDrive ? (
                <div className="relative w-full h-full">
                  <iframe 
                    src={getEmbedUrl(document.downloadUrl)}
                    className="w-full h-full"
                    title={`Preview of ${document.name}`}
                    style={{ 
                      border: 'none',
                      pointerEvents: 'none'
                    }}
                    loading="lazy"
                  />
                  {/* Overlay to prevent interaction */}
                  <div className="absolute inset-0 bg-transparent" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-start p-6 space-y-3 opacity-50">
                  {/* Document content lines with varying widths */}
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-full" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-11/12" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-10/12" />
                  <div className="h-1 bg-transparent" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-full" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-9/12" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-11/12" />
                  <div className="h-1 bg-transparent" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-full" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-8/12" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-10/12" />
                  <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-300 w-9/12" />
                </div>
              )}
            </div>
            
            {/* Enhanced hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/2 group-hover:to-blue-500/5 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30">
              <div className="bg-white/95 backdrop-blur-md px-6 py-4 shadow-2xl border border-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Click to open document
                </div>
              </div>
            </div>
          </div>
          
          {/* Realistic page corner fold effect */}
          <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 transform rotate-45 translate-x-5 -translate-y-5 shadow-lg opacity-60" />
          <div className="absolute top-0.5 right-0.5 w-8 h-8 bg-gradient-to-br from-white to-gray-50 transform rotate-45 translate-x-4 -translate-y-4 shadow-md" />
          
          {/* Paper depth shadow */}
          <div className="absolute -bottom-1 -right-1 w-full h-full bg-gray-400/20 -z-10" />
          <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-400/10 -z-20" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No project data available</p>
      </div>
    )
  }

  const projectDocuments = project.documents || []
  const dbAttachments = attachments || []
  const allDocuments = [...projectDocuments, ...dbAttachments.map(att => ({
    name: att.filename || 'Unnamed document',
    type: getFileTypeFromMimeType(att.mimeType),
    size: formatFileSize(att.sizeBytes),
    downloadUrl: att.fileUrl || '#',
    uploadedAt: att.uploadedAt,
    isDbAttachment: true
  }))].filter(doc => {
    // Only show Word, PDF, and Excel files
    const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    return allowedTypes.includes(doc.type.toLowerCase())
  }) as Array<{
    name: string
    type: string
    size: string
    downloadUrl: string
    uploadedAt?: Date | null
    isDbAttachment?: boolean
  }>

  return (
    <div className="space-y-6">
      {/* Project Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Project Overview
          </CardTitle>
          <CardDescription>
            Essential project information and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.budgetAbc && (
              <div className="p-3 rounded-lg border bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground">Budget</div>
                <div className="text-lg font-bold text-primary">{project.budgetAbc}</div>
              </div>
            )}
            {project.procurementMode && (
              <div className="p-3 rounded-lg border bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground">Procurement Mode</div>
                <div className="text-sm font-medium">{project.procurementMode}</div>
              </div>
            )}
            {project.classification && (
              <div className="p-3 rounded-lg border bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground">Classification</div>
                <div className="text-sm font-medium">{project.classification}</div>
              </div>
            )}
            <div className="p-3 rounded-lg border bg-muted/30">
              <div className="text-sm font-medium text-muted-foreground">Documents</div>
              <div className="text-lg font-bold text-primary">{allDocuments.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              Key Requirements
            </CardTitle>
            <CardDescription>
              Important eligibility and technical requirements for bidders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed bg-muted/30 p-4 rounded-lg">
                {project.keyRequirements}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Document Library (Updated)
          </CardTitle>
          <CardDescription>
            Browse and preview all project documents and attachments - Word, PDF, Excel files only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <div className="font-medium">Total Documents</div>
                <div className="text-sm text-muted-foreground">
                  {allDocuments.length} files available (Word/PDF/Excel only)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
              <Clock className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-sm text-muted-foreground">
                  {dbAttachments.length > 0 ? formatDate(dbAttachments[0]?.uploadedAt) : 'No updates'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Available Documents
          </CardTitle>
          <CardDescription>
            Click on any document to preview or download
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDocuments.map((document, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      {getBondPaperPreview(document)}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getFileIcon(document.type)}
                        <span className="truncate">{document.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {document.type}
                        </Badge>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {getDocumentPreview(document)}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{document.type} • {document.size}</span>
                          {document.isDbAttachment && document.uploadedAt && (
                            <span>Uploaded {formatDate(new Date(document.uploadedAt))}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {document.downloadUrl && document.downloadUrl !== '#' && (
                          <Button variant="outline" asChild>
                            <a 
                              href={document.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Google Drive
                            </a>
                          </Button>
                        )}
                        {document.downloadUrl && document.downloadUrl !== '#' && (
                          <Button asChild>
                            <a 
                              href={document.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              View Document
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No Documents Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No documents have been uploaded for this project yet.
              </p>
              <Button variant="outline" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit PhilGEPS (Disabled for Testing)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Documents are retrieved from the project database. 
          For the most current official bidding documents, please visit the PhilGEPS website directly.
          Preview functionality depends on file type and availability.
        </AlertDescription>
      </Alert>
    </div>
  )
}