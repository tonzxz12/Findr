"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp, IconBuilding, IconCurrencyPeso, IconCircleCheck, IconClock } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardMetrics {
  totalProjects: number
  activeProjects: number
  totalBudget: number
  completedProjects: number
}

export function SectionCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
    completedProjects: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        setMetrics(data.metrics)
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-8 bg-muted animate-pulse rounded mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalProjects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBuilding className="w-3 h-3 mr-1" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            PhilGEPS Procurement Projects <IconBuilding className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Government tenders tracked
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeProjects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="w-3 h-3 mr-1" />
              Open
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently accepting bids <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Available for bidding
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Budget</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.totalBudget)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyPeso className="w-3 h-3 mr-1" />
              PHP
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Approved Budget for Contracts <IconCurrencyPeso className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Government procurement value
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.completedProjects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCircleCheck className="w-3 h-3 mr-1" />
              Closed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successfully completed <IconCircleCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Bidding period ended
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
