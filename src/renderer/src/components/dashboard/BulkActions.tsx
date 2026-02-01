import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  ChevronDown,
  CheckSquare,
  Square,
  Trash2,
  Download,
  FolderOpen,
  RotateCcw
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface BulkActionsProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onDeleteSelected: () => void
  onRetrySelected?: () => void
  onOpenFolder?: () => void
  onExportSelected?: () => void
}

export function BulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onRetrySelected,
  onOpenFolder,
  onExportSelected
}: BulkActionsProps) {
  const { t } = useTranslation()
  const hasSelection = selectedCount > 0
  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {allSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {hasSelection
              ? t('dashboard.bulkActions.selected', { count: selectedCount })
              : t('dashboard.bulkActions.select')}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onSelectAll}>
            <CheckSquare className="h-4 w-4" />
            {t('dashboard.bulkActions.selectAll')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeselectAll} disabled={!hasSelection}>
            <Square className="h-4 w-4" />
            {t('dashboard.bulkActions.deselectAll')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasSelection && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
              {t('dashboard.bulkActions.actions')}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {onRetrySelected && (
              <DropdownMenuItem onClick={onRetrySelected}>
                <RotateCcw className="h-4 w-4" />
                {t('dashboard.bulkActions.retry')}
              </DropdownMenuItem>
            )}
            {onOpenFolder && (
              <DropdownMenuItem onClick={onOpenFolder}>
                <FolderOpen className="h-4 w-4" />
                {t('dashboard.bulkActions.openFolder')}
              </DropdownMenuItem>
            )}
            {onExportSelected && (
              <DropdownMenuItem onClick={onExportSelected}>
                <Download className="h-4 w-4" />
                {t('dashboard.bulkActions.export')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeleteSelected} className="text-red-600">
              <Trash2 className="h-4 w-4" />
              {t('dashboard.bulkActions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
