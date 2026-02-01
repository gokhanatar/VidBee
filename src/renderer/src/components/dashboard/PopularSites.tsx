import { Badge } from '@renderer/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Progress } from '@renderer/components/ui/progress'
import { downloadsArrayAtom } from '@renderer/store/downloads'
import { useAtomValue } from 'jotai'
import { Globe } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function PopularSites() {
  const { t } = useTranslation()
  const allRecords = useAtomValue(downloadsArrayAtom)

  const siteStats = useMemo(() => {
    const siteMap = new Map<string, { count: number; completed: number }>()

    allRecords.forEach((record) => {
      try {
        const url = new URL(record.url)
        const hostname = url.hostname.replace('www.', '')

        const existing = siteMap.get(hostname) || { count: 0, completed: 0 }
        existing.count++
        if (record.status === 'completed') {
          existing.completed++
        }
        siteMap.set(hostname, existing)
      } catch {
        // Invalid URL, skip
      }
    })

    return Array.from(siteMap.entries())
      .map(([site, stats]) => ({
        site,
        count: stats.count,
        completed: stats.completed,
        successRate: stats.count > 0 ? (stats.completed / stats.count) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [allRecords])

  const maxCount = siteStats.length > 0 ? siteStats[0].count : 1

  if (siteStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.popularSites.title')}</CardTitle>
          <CardDescription>{t('dashboard.popularSites.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">{t('dashboard.popularSites.noData')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.popularSites.title')}</CardTitle>
        <CardDescription>{t('dashboard.popularSites.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {siteStats.map((stat, index) => {
            const percentage = (stat.count / maxCount) * 100

            return (
              <div key={stat.site} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-semibold">{stat.site}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {stat.count}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(stat.successRate)}%
                    </span>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
