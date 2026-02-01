import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { ipcServices } from '@renderer/lib/ipc'
import { settingsAtom } from '@renderer/store/settings'
import { useAtomValue } from 'jotai'
import {
  FolderOpen,
  Settings,
  Download,
  Rss,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface QuickActionsProps {
  onOpenDownloadDialog?: () => void
  onOpenSettings?: () => void
  onOpenSubscriptions?: () => void
  onClearCompleted?: () => void
  onRefreshAll?: () => void
}

export function QuickActions({
  onOpenDownloadDialog,
  onOpenSettings,
  onOpenSubscriptions,
  onClearCompleted,
  onRefreshAll
}: QuickActionsProps) {
  const { t } = useTranslation()
  const settings = useAtomValue(settingsAtom)

  const handleOpenDownloadFolder = async () => {
    try {
      await ipcServices.fs.openPath(settings.downloadPath)
      toast.success(t('dashboard.quickActions.folderOpened'))
    } catch (error) {
      console.error('Failed to open download folder:', error)
      toast.error(t('dashboard.quickActions.folderOpenError'))
    }
  }

  const actions = [
    {
      icon: <Download className="h-5 w-5" />,
      label: t('dashboard.quickActions.newDownload'),
      description: t('dashboard.quickActions.newDownloadDesc'),
      onClick: onOpenDownloadDialog,
      variant: 'default' as const,
      colorClass: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      label: t('dashboard.quickActions.openFolder'),
      description: t('dashboard.quickActions.openFolderDesc'),
      onClick: handleOpenDownloadFolder,
      variant: 'outline' as const
    },
    {
      icon: <Rss className="h-5 w-5" />,
      label: t('dashboard.quickActions.subscriptions'),
      description: t('dashboard.quickActions.subscriptionsDesc'),
      onClick: onOpenSubscriptions,
      variant: 'outline' as const
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: t('dashboard.quickActions.settings'),
      description: t('dashboard.quickActions.settingsDesc'),
      onClick: onOpenSettings,
      variant: 'outline' as const
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      label: t('dashboard.quickActions.refreshAll'),
      description: t('dashboard.quickActions.refreshAllDesc'),
      onClick: onRefreshAll,
      variant: 'outline' as const
    },
    {
      icon: <Trash2 className="h-5 w-5" />,
      label: t('dashboard.quickActions.clearCompleted'),
      description: t('dashboard.quickActions.clearCompletedDesc'),
      onClick: onClearCompleted,
      variant: 'outline' as const,
      colorClass: 'text-red-600 hover:bg-red-50'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
        <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className={`h-auto flex-col items-start gap-2 p-4 ${action.colorClass || ''}`}
            onClick={action.onClick}
            disabled={!action.onClick}
          >
            <div className="flex items-center gap-2 w-full">
              {action.icon}
              <span className="font-semibold text-sm">{action.label}</span>
            </div>
            <span className="text-xs font-normal text-left opacity-80">
              {action.description}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
