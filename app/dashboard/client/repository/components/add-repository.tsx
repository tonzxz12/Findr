"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface AddRepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (repository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>) => void
}

interface Repository {
  id: string
  clientId: string
  name: string
  type: 'code' | 'data' | 'api' | 'document' | 'config'
  url?: string
  description?: string
  status: 'active' | 'archived' | 'maintenance'
  environment: 'production' | 'staging' | 'development' | 'test'
  tags: string[]
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export function AddRepositoryModal({ isOpen, onClose, onAdd }: AddRepositoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '' as Repository['type'],
    url: '',
    description: '',
    status: 'active' as Repository['status'],
    environment: 'development' as Repository['environment'],
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type) {
      return
    }

    const newRepository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: 'client-1', // TODO: Get from current user context
      name: formData.name,
      type: formData.type,
      url: formData.url || undefined,
      description: formData.description || undefined,
      status: formData.status,
      environment: formData.environment,
      tags: formData.tags,
      lastUpdated: new Date().toISOString()
    }

    onAdd(newRepository)

    // Reset form
    setFormData({
      name: '',
      type: '' as Repository['type'],
      url: '',
      description: '',
      status: 'active',
      environment: 'development',
      tags: []
    })
    setTagInput('')
    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Repository</DialogTitle>
          <DialogDescription>
            Create a new repository to track your code, data, APIs, or documentation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            {/* Repository Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Repository Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., ABC Construction API"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: Repository['type']) =>
                  setFormData(prev => ({ ...prev, type: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repository type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Code Repository</SelectItem>
                  <SelectItem value="data">Data Repository</SelectItem>
                  <SelectItem value="api">API Repository</SelectItem>
                  <SelectItem value="document">Document Repository</SelectItem>
                  <SelectItem value="config">Configuration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://github.com/username/repo or https://api.example.com"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this repository..."
                rows={3}
              />
            </div>

            {/* Environment */}
            <div className="space-y-2">
              <Label htmlFor="environment" className="text-sm font-medium">
                Environment
              </Label>
              <Select
                value={formData.environment}
                onValueChange={(value: Repository['environment']) =>
                  setFormData(prev => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Repository['status']) =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.type}>
              Add Repository
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
