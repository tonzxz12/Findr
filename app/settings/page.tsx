import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Settings,
  Save,
  Building2,
  User,
  Bell,
  Shield,
  Database,
  Bot,
  Mail,
  Key,
  Globe,
  Palette
} from "lucide-react"

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">QFindr</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Configure your QFindr application preferences
              </p>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Company Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Update your company details and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name"
                    defaultValue="Sample Construction Corp"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company-address">Business Address</Label>
                  <Textarea 
                    id="company-address"
                    defaultValue="123 Business Street, Makati City, Metro Manila, Philippines"
                    placeholder="Enter complete business address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tin">TIN</Label>
                    <Input 
                      id="tin"
                      defaultValue="123-456-789-000"
                      placeholder="Tax Identification Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="philgeps-reg">PhilGEPS Registration</Label>
                    <Input 
                      id="philgeps-reg"
                      defaultValue="REG-2024-001234"
                      placeholder="PhilGEPS Registration ID"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company-website">Company Website</Label>
                  <Input 
                    id="company-website"
                    defaultValue="https://samplecorp.com"
                    placeholder="https://your-website.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input 
                    id="full-name"
                    defaultValue="Admin User"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    defaultValue="admin@company.com"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    defaultValue="+63 917 123 4567"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position/Title</Label>
                  <Input 
                    id="position"
                    defaultValue="Project Manager"
                    placeholder="Enter your position"
                  />
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI models and generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ai-model">Default AI Model</Label>
                  <select 
                    id="ai-model"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="gpt-4">GPT-4 (Recommended)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <Input 
                    id="api-key"
                    type="password"
                    defaultValue="sk-************************************************"
                    placeholder="Enter your OpenAI API key"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-generate documents</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate documents when projects are added
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Quality review</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable AI quality review for generated documents
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cost optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Use cost-optimized models for simple tasks
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Project deadlines</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about upcoming project deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Document completion</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when AI document generation completes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Workflow updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get updates about n8n workflow executions
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Team activities</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about team member activities
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input 
                    id="notification-email"
                    type="email"
                    defaultValue="admin@company.com"
                    placeholder="Email for notifications"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Integration Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integration Settings
                </CardTitle>
                <CardDescription>
                  Configure external integrations and APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="n8n-url">n8n Workspace URL</Label>
                  <Input 
                    id="n8n-url"
                    defaultValue="https://n8n.company.com"
                    placeholder="Enter your n8n instance URL"
                  />
                </div>

                <div>
                  <Label htmlFor="n8n-token">n8n API Token</Label>
                  <Input 
                    id="n8n-token"
                    type="password"
                    defaultValue="************************************************"
                    placeholder="Enter your n8n API token"
                  />
                </div>

                <div>
                  <Label htmlFor="philgeps-api">PhilGEPS API Configuration</Label>
                  <Input 
                    id="philgeps-api"
                    defaultValue="https://api.philgeps.gov.ph/v1"
                    placeholder="PhilGEPS API endpoint"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync projects</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync new PhilGEPS projects
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Workflow monitoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor n8n workflow executions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
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
                  Manage security and access control settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-factor authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div>
                  <Label htmlFor="session-duration">Session Duration (hours)</Label>
                  <select 
                    id="session-duration"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="8">8 hours</option>
                    <option value="24">24 hours (1 day)</option>
                    <option value="168">1 week</option>
                    <option value="720">1 month</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                  <Textarea 
                    id="allowed-ips"
                    placeholder="Enter allowed IP addresses (one per line)&#10;Example:&#10;192.168.1.0/24&#10;203.177.x.x"
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to allow access from any IP address
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button at Bottom */}
          <div className="flex justify-end">
            <Button size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
