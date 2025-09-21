"use client"

import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTenant } from "@/lib/context/tenant-context"

interface Project {
  id: number
  title: string
  procuringEntity: string
  abc: number
  parsedClosingAt: string
  category: string
  createdAt: string
}

interface DashboardData {
  metrics: {
    totalProjects: number
    activeProjects: number
    totalBudget: number
    completedProjects: number
  }
  projectsByStatus: Array<{
    status: string
    count: number
  }>
  recentProjects: Project[]
  projectsOverTime: Array<{
    month: string
    count: number
  }>
  budgetByCategory: Array<{
    category: string | null
    totalBudget: number | null
    count: number
  }>
  procurementModes: Array<{
    mode: string | null
    count: number
  }>
}

export default function Page() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { currentUser } = useTenant()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <>
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">PhilGEPS AI</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 border-b">
            <div className="px-4 lg:px-6 py-8 md:py-12">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Client Dashboard</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                      Welcome back, <span className="font-semibold text-slate-600 dark:text-slate-400">{currentUser?.name || 'User'}</span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                  Monitor your procurement projects, track progress, and stay updated with the latest opportunities in the Philippine procurement landscape.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Project Analytics</h2>
                    <p className="text-muted-foreground">Track project trends and performance over time</p>
                  </div>
                </div>
                <ChartAreaInteractive projectsOverTime={dashboardData?.projectsOverTime} />
              </div>
            </div>
            <div className="px-4 lg:px-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Recent Projects</h2>
                      <p className="text-muted-foreground">Latest procurement opportunities and updates</p>
                    </div>
                  </div>
                </div>
                <DataTable data={dashboardData?.recentProjects || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}