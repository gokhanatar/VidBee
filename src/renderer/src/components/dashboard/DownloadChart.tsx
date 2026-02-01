import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { cn } from '@renderer/lib/utils'
import { downloadsArrayAtom } from '@renderer/store/downloads'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function DownloadChart() {
  const { t } = useTranslation()
  const allRecords = useAtomValue(downloadsArrayAtom)

  const chartData = useMemo(() => {
    const now = Date.now()
    const days = 7
    const data: Array<{ label: string; value: number; completed: number; failed: number }> = []

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000
      const dayEnd = dayStart + 24 * 60 * 60 * 1000

      const dayRecords = allRecords.filter(
        (r) => r.createdAt >= dayStart && r.createdAt < dayEnd
      )

      const completed = dayRecords.filter((r) => r.status === 'completed').length
      const failed = dayRecords.filter((r) => r.status === 'error').length

      const date = new Date(dayStart)
      const label = date.toLocaleDateString('en-US', { weekday: 'short' })

      data.push({
        label,
        value: dayRecords.length,
        completed,
        failed
      })
    }

    return data
  }, [allRecords])

  const maxValue = Math.max(...chartData.map((d) => d.value), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.chart.title')}</CardTitle>
        <CardDescription>{t('dashboard.chart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-2 h-48">
            {chartData.map((day, index) => {
              const heightPercentage = (day.value / maxValue) * 100
              const completedPercentage = day.value > 0 ? (day.completed / day.value) * 100 : 0
              const failedPercentage = day.value > 0 ? (day.failed / day.value) * 100 : 0

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div className="relative w-full h-full flex items-end">
                    <div
                      className={cn(
                        'w-full rounded-t-md bg-gradient-to-t transition-all hover:opacity-80',
                        day.value === 0
                          ? 'from-muted to-muted'
                          : 'from-blue-400 to-blue-600'
                      )}
                      style={{
                        height: `${heightPercentage}%`,
                        minHeight: day.value > 0 ? '8px' : '4px'
                      }}
                      title={`${day.label}: ${day.value} downloads\nCompleted: ${day.completed}\nFailed: ${day.failed}`}
                    >
                      {day.value > 0 && (
                        <div className="absolute inset-0 flex flex-col-reverse">
                          {completedPercentage > 0 && (
                            <div
                              className="w-full bg-emerald-500 rounded-t-md"
                              style={{ height: `${completedPercentage}%` }}
                            />
                          )}
                          {failedPercentage > 0 && (
                            <div
                              className="w-full bg-red-500"
                              style={{ height: `${failedPercentage}%` }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {day.label}
                  </div>
                  <div className="text-xs font-bold">
                    {day.value}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-gradient-to-t from-blue-400 to-blue-600" />
              <span className="text-muted-foreground">{t('dashboard.chart.total')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span className="text-muted-foreground">{t('dashboard.chart.completed')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-red-500" />
              <span className="text-muted-foreground">{t('dashboard.chart.failed')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
