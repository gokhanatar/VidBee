import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { cn } from '@renderer/lib/utils'
import { downloadStatsAtom, downloadsArrayAtom } from '@renderer/store/downloads'
import { useAtomValue } from 'jotai'
import {
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  HardDrive,
  Globe
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
}

function StatCard({ title, value, description, icon, trend, colorClass }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('rounded-full p-2', colorClass || 'bg-primary/10')}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium mt-2',
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            <TrendingUp
              className={cn('h-3 w-3', !trend.isPositive && 'rotate-180')}
            />
            <span>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const { t } = useTranslation()
  const downloadStats = useAtomValue(downloadStatsAtom)
  const allRecords = useAtomValue(downloadsArrayAtom)

  const additionalStats = useMemo(() => {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

    const last24h = allRecords.filter((r) => r.createdAt >= oneDayAgo).length
    const lastWeek = allRecords.filter((r) => r.createdAt >= oneWeekAgo).length

    const uniqueSites = new Set(
      allRecords.map((r) => {
        try {
          const url = new URL(r.url)
          return url.hostname
        } catch {
          return 'unknown'
        }
      })
    ).size

    const videoCount = allRecords.filter((r) => r.type === 'video').length
    const audioCount = allRecords.filter((r) => r.type === 'audio').length

    return {
      last24h,
      lastWeek,
      uniqueSites,
      videoCount,
      audioCount,
      successRate:
        downloadStats.total > 0
          ? Math.round((downloadStats.completed / downloadStats.total) * 100)
          : 0
    }
  }, [allRecords, downloadStats])

  const stats: StatCardProps[] = [
    {
      title: t('dashboard.stats.totalDownloads'),
      value: downloadStats.total,
      description: t('dashboard.stats.totalDownloadsDesc'),
      icon: <Download className="h-4 w-4 text-blue-600" />,
      colorClass: 'bg-blue-500/10'
    },
    {
      title: t('dashboard.stats.completed'),
      value: downloadStats.completed,
      description: `${additionalStats.successRate}% ${t('dashboard.stats.successRate')}`,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
      colorClass: 'bg-emerald-500/10'
    },
    {
      title: t('dashboard.stats.active'),
      value: downloadStats.active,
      description: t('dashboard.stats.activeDesc'),
      icon: <Clock className="h-4 w-4 text-amber-600" />,
      colorClass: 'bg-amber-500/10'
    },
    {
      title: t('dashboard.stats.failed'),
      value: downloadStats.error,
      description: t('dashboard.stats.failedDesc'),
      icon: <XCircle className="h-4 w-4 text-red-600" />,
      colorClass: 'bg-red-500/10'
    },
    {
      title: t('dashboard.stats.last24h'),
      value: additionalStats.last24h,
      description: t('dashboard.stats.last24hDesc'),
      icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
      colorClass: 'bg-purple-500/10'
    },
    {
      title: t('dashboard.stats.uniqueSites'),
      value: additionalStats.uniqueSites,
      description: t('dashboard.stats.uniqueSitesDesc'),
      icon: <Globe className="h-4 w-4 text-cyan-600" />,
      colorClass: 'bg-cyan-500/10'
    },
    {
      title: t('dashboard.stats.videoCount'),
      value: additionalStats.videoCount,
      description: t('dashboard.stats.videoCountDesc'),
      icon: <HardDrive className="h-4 w-4 text-indigo-600" />,
      colorClass: 'bg-indigo-500/10'
    },
    {
      title: t('dashboard.stats.audioCount'),
      value: additionalStats.audioCount,
      description: t('dashboard.stats.audioCountDesc'),
      icon: <HardDrive className="h-4 w-4 text-pink-600" />,
      colorClass: 'bg-pink-500/10'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
