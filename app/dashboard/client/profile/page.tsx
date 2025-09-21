"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Settings, 
  Save,
  Upload,
  Eye,
  EyeOff
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types based on your schema
interface UserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  company: string | null
  profilePicture: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalProjects: number
  activeProjects: number
  wonBids: number
  totalValue: number
  successRate: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Simulated data based on your schema
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with real API call to your database
        // const response = await db.select().from(users).where(eq(users.id, currentUserId))
        
        const mockUser: UserProfile = {
          id: "user-1",
          email: "john.doe@company.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "+63 912 345 6789",
          company: "ABC Construction Corp",
          profilePicture: null,
          isActive: true,
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-01-20T10:30:00Z"
        }

        const mockStats: UserStats = {
          totalProjects: 15,
          activeProjects: 3,
          wonBids: 8,
          totalValue: 45000000,
          successRate: 53.3
        }
        
        setUser(mockUser)
        setStats(mockStats)
        setFormData({
          firstName: mockUser.firstName || '',
          lastName: mockUser.lastName || '',
          email: mockUser.email,
          phoneNumber: mockUser.phoneNumber || '',
          company: mockUser.company || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement API call to update user profile
      // await db.update(users).set({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   phoneNumber: formData.phoneNumber,
      //   company: formData.company,
      //   updatedAt: new Date().toISOString()
      // }).where(eq(users.id, user.id))
      
      console.log('Saving profile:', formData)
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error('Error saving profile:', error)
      // Show error message
    }
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match")
      return
    }
    
    try {
      // TODO: Implement password change API call
      console.log('Changing password')
      setShowPasswordForm(false)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      // Show success message
    } catch (error) {
      console.error('Error changing password:', error)
      // Show error message
    }
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
  }

  if (isLoading) {
    return <LoadingScreen message="Loading profile..." size={100} />
  }

  if (!user || !stats) {
    return <div>Error loading profile</div>
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
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profilePicture || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription>{user.company}</CardDescription>
                <Badge variant={user.isActive ? "default" : "secondary"} className="mt-2">
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.company}</span>
                  </div>
                )}
                <Separator />
                <div className="text-xs text-muted-foreground">
                  <div>Member since: {formatDate(user.createdAt)}</div>
                  <div>Last updated: {formatDate(user.updatedAt)}</div>
                </div>
                <Button className="w-full" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Projects</span>
                  <span className="font-medium">{stats.totalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-medium">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Won Bids</span>
                  <span className="font-medium text-green-600">{stats.wonBids}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-medium">{formatCurrency(stats.totalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-medium">{stats.successRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList>
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        disabled={!isEditing}
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your company name"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!showPasswordForm ? (
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-muted-foreground">
                            Last changed on {formatDate(user.updatedAt)}
                          </p>
                        </div>
                        <Button onClick={() => setShowPasswordForm(true)}>
                          Change Password
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium">Change Password</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleChangePassword}>
                              Update Password
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your experience and notification settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Email Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">New Projects</span>
                            <p className="text-sm text-muted-foreground">Get notified about new PhilGEPS projects</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">Bid Deadlines</span>
                            <p className="text-sm text-muted-foreground">Reminders for upcoming deadlines</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">Pre-bid Conferences</span>
                            <p className="text-sm text-muted-foreground">Notifications about pre-bid meetings</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Display Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Dark Mode</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Compact View</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}