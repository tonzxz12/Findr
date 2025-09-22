"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  Building,
  Settings,
  Save,
  Camera,
  Shield,
  Bell,
  Palette,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Target,
  Briefcase,
  Clock,
  AlertTriangle
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
import { Textarea } from "@/components/ui/textarea"

// Types based on your database schema
interface UserProfile {
  id: string
  email: string
  passwordHash?: string
  fullName: string
  phone?: string
  role: 'admin' | 'client'
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  client?: ClientProfile
}

interface ClientProfile {
  id: string
  companyName: string
  keywords: string[]
  ownerUserId?: string
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
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    bio: '',
    location: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    newProjects: true,
    bidDeadlines: true,
    prebidConferences: true,
    emailUpdates: false,
    smsNotifications: false
  })

  // Display preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoSave: true,
    showStats: true
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
          fullName: "John Doe",
          phone: "+63 912 345 6789",
          role: "client",
          isActive: true,
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-01-20T10:30:00Z",
          client: {
            id: "client-1",
            companyName: "ABC Construction Corp",
            keywords: ["construction", "infrastructure", "philippines"],
            ownerUserId: "user-1",
            createdAt: "2024-01-15T08:00:00Z",
            updatedAt: "2024-01-20T10:30:00Z"
          }
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
          fullName: mockUser.fullName,
          email: mockUser.email,
          phone: mockUser.phone || '',
          companyName: mockUser.client?.companyName || '',
          bio: 'Experienced procurement professional with 8+ years in government contracting and construction project management.',
          location: 'Manila, Philippines',
          website: 'https://abcconstruction.com',
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

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement API call to update user profile
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

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U'
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600'
    if (rate >= 50) return 'text-yellow-600'
    return 'text-red-600'
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
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <Avatar className="relative h-32 w-32 border-4 border-white dark:border-slate-800 shadow-xl">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg"
                  variant="default"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {user.fullName}
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-300 mt-1">
                    {user.client?.companyName}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Active Member
                    </Badge>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Member since {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProjects}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total Projects</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.wonBids}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Won Bids</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total Value</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.successRate}%</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full h-auto p-0 bg-transparent">
            <div className="flex items-center justify-between w-full">
              <TabsTrigger
                value="overview"
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Overview</div>
                    <div className="text-xs opacity-70">Profile summary</div>
                  </div>
                </div>
              </TabsTrigger>

              <div className="w-12 h-px bg-border mx-1" />

              <TabsTrigger
                value="personal"
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    2
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Personal</div>
                    <div className="text-xs opacity-70">Edit details</div>
                  </div>
                </div>
              </TabsTrigger>

              <div className="w-12 h-px bg-border mx-1" />

              <TabsTrigger
                value="security"
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    3
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Security</div>
                    <div className="text-xs opacity-70">Account safety</div>
                  </div>
                </div>
              </TabsTrigger>

              <div className="w-12 h-px bg-border mx-1" />

              <TabsTrigger
                value="preferences"
                className="flex-1 h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                    4
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium">Preferences</div>
                    <div className="text-xs opacity-70">Settings</div>
                  </div>
                </div>
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Contact Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Your contact details and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Email Address</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Phone Number</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Building className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Company</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.client?.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Location</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Manila, Philippines</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">About</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Experienced procurement professional with 8+ years in government contracting and construction project management.
                      Specialized in PhilGEPS compliance and bid preparation for infrastructure projects.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance
                  </CardTitle>
                  <CardDescription>
                    Your bidding performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Success Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className={`text-sm font-bold ${getSuccessRateColor(stats.successRate)}`}>
                        {stats.successRate}%
                      </span>
                    </div>
                    <Progress value={stats.successRate} className="h-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {stats.wonBids} wins out of {stats.totalProjects} bids
                    </p>
                  </div>

                  {/* Active Projects */}
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Active Projects</p>
                        <p className="text-lg font-bold text-amber-600">{stats.activeProjects}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-slate-600 dark:text-slate-400">Won bid for Hospital Renovation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-slate-600 dark:text-slate-400">Submitted proposal for Road Project</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-slate-600 dark:text-slate-400">Attended pre-bid conference</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and professional information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="+63 912 345 6789"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium">Company</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your company name"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    className="min-h-24 resize-none"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showPasswordForm ? (
                    <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Last changed on {formatDate(user.updatedAt)}
                        </p>
                      </div>
                      <Button onClick={() => setShowPasswordForm(true)} variant="outline">
                        Change Password
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="font-medium">Change Password</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
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
                          <Button onClick={handleChangePassword} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Additional security measures for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Shield className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-900 dark:text-green-100">Two-Factor Authentication</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">Not enabled</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">Login Sessions</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">1 active session</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        Manage
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100">Account Deletion</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">Permanently delete your account</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">New Projects</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Get notified about new PhilGEPS projects</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.newProjects}
                        onCheckedChange={(checked) => handleNotificationChange('newProjects', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <Clock className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Bid Deadlines</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Reminders for upcoming deadlines</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.bidDeadlines}
                        onCheckedChange={(checked) => handleNotificationChange('bidDeadlines', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Pre-bid Conferences</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Notifications about pre-bid meetings</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.prebidConferences}
                        onCheckedChange={(checked) => handleNotificationChange('prebidConferences', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Mail className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Updates</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Weekly summary emails</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.emailUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Phone className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Important alerts via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Display Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your experience and interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <Palette className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Switch to dark theme</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Compact View</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Show more content in less space</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.compactView}
                        onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <Save className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Auto-save</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Automatically save your changes</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Show Statistics</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Display performance metrics</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.showStats}
                        onCheckedChange={(checked) => handlePreferenceChange('showStats', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Language & Region</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Current: English (Philippines)
                    </p>
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      Change Language
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
