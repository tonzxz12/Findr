import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects, clients } from '@/lib/db'
import { desc, sql, count, sum } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get total projects count
    const totalProjectsResult = await db
      .select({ count: count() })
      .from(projects)

    const totalProjects = totalProjectsResult[0]?.count || 0

    // Get active projects (projects that haven't closed yet)
    const activeProjectsResult = await db
      .select({ count: count() })
      .from(projects)
      .where(sql`${projects.parsedClosingAt} > NOW() OR ${projects.parsedClosingAt} IS NULL`)

    const activeProjects = activeProjectsResult[0]?.count || 0

    // Get total budget (sum of ABC values)
    const totalBudgetResult = await db
      .select({ total: sum(projects.abc) })
      .from(projects)

    const totalBudget = totalBudgetResult[0]?.total || 0

    // Get projects by status (we'll categorize by closing date)
    const projectsByStatus = await db
      .select({
        status: sql<string>`
          CASE
            WHEN ${projects.parsedClosingAt} < NOW() THEN 'Closed'
            WHEN ${projects.parsedClosingAt} > NOW() THEN 'Active'
            ELSE 'Pending'
          END
        `,
        count: count(),
      })
      .from(projects)
      .groupBy(sql`
        CASE
          WHEN ${projects.parsedClosingAt} < NOW() THEN 'Closed'
          WHEN ${projects.parsedClosingAt} > NOW() THEN 'Active'
          ELSE 'Pending'
        END
      `)

    // Get recent projects
    const recentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        procuringEntity: projects.procuringEntity,
        abc: projects.abc,
        parsedClosingAt: projects.parsedClosingAt,
        category: projects.category,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(10)

    // Get projects over time (last 12 months)
    const projectsOverTime = await db
      .select({
        month: sql<string>`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(projects)
      .where(sql`${projects.createdAt} >= NOW() - INTERVAL '12 months'`)
      .groupBy(sql`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`)

    // Get budget by category
    const budgetByCategory = await db
      .select({
        category: projects.category,
        totalBudget: sum(projects.abc),
        count: count(),
      })
      .from(projects)
      .where(sql`${projects.category} IS NOT NULL`)
      .groupBy(projects.category)
      .orderBy(desc(sum(projects.abc)))

    // Get procurement mode distribution
    const procurementModes = await db
      .select({
        mode: projects.procurementMode,
        count: count(),
      })
      .from(projects)
      .where(sql`${projects.procurementMode} IS NOT NULL`)
      .groupBy(projects.procurementMode)
      .orderBy(desc(count()))

    return NextResponse.json({
      metrics: {
        totalProjects,
        activeProjects,
        totalBudget: Number(totalBudget),
        completedProjects: totalProjects - activeProjects,
      },
      projectsByStatus,
      recentProjects,
      projectsOverTime,
      budgetByCategory,
      procurementModes,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}