import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FileText, Building2, Zap, Users, TrendingUp, Clock } from "lucide-react"

export default function Page() {
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
                <BreadcrumbLink href="#">QFindr</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to QFindr</h1>
            <p className="text-muted-foreground">
              Manage your government procurement projects and generate AI-powered bidding documents.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Documents Generated
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +15 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Jobs Running
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Processing documents
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  Bid acceptance rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Latest PhilGEPS projects added to the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">
                      Supply and Delivery of Office Equipment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      DOH - Central Office • Deadline: Dec 15, 2024
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₱2.5M
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">
                      IT Infrastructure Modernization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      DOST - Regional Office • Deadline: Jan 20, 2025
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₱15.8M
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">
                      Construction Materials Supply
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      DPWH - Region IV-A • Deadline: Nov 30, 2024
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₱8.2M
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-start space-x-3 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Add New Project</span>
                </button>
                <button className="w-full flex items-center justify-start space-x-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Generate Document</span>
                </button>
                <button className="w-full flex items-center justify-start space-x-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Manage Team</span>
                </button>
                <button className="w-full flex items-center justify-start space-x-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">View Deadlines</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
