import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface FilterOptions {
  searchQuery: string
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom'
  dateFrom?: string
  dateTo?: string
  fileType: 'all' | 'video' | 'audio'
  site: string
  status: 'all' | 'active' | 'completed' | 'error'
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  availableSites?: string[]
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  availableSites = []
}: AdvancedFiltersProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const hasActiveFilters =
    filters.searchQuery ||
    filters.dateRange !== 'all' ||
    filters.fileType !== 'all' ||
    filters.site !== 'all' ||
    filters.status !== 'all'

  const handleApply = () => {
    onFiltersChange(localFilters)
    setOpen(false)
  }

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      searchQuery: '',
      dateRange: 'all',
      fileType: 'all',
      site: 'all',
      status: 'all'
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const handleClear = () => {
    handleReset()
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder={t('dashboard.filters.searchPlaceholder')}
        value={filters.searchQuery}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            searchQuery: e.target.value
          })
        }
        className="max-w-sm"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('dashboard.filters.title')}
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                •
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{t('dashboard.filters.advanced')}</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-auto p-1 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  {t('dashboard.filters.clear')}
                </Button>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>{t('dashboard.filters.dateRange')}</Label>
                <Select
                  value={localFilters.dateRange}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      dateRange: value as FilterOptions['dateRange']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('dashboard.filters.allTime')}</SelectItem>
                    <SelectItem value="today">{t('dashboard.filters.today')}</SelectItem>
                    <SelectItem value="week">{t('dashboard.filters.thisWeek')}</SelectItem>
                    <SelectItem value="month">{t('dashboard.filters.thisMonth')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('dashboard.filters.fileType')}</Label>
                <Select
                  value={localFilters.fileType}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      fileType: value as FilterOptions['fileType']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('dashboard.filters.allTypes')}</SelectItem>
                    <SelectItem value="video">{t('download.video')}</SelectItem>
                    <SelectItem value="audio">{t('download.audio')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('dashboard.filters.status')}</Label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      status: value as FilterOptions['status']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('download.all')}</SelectItem>
                    <SelectItem value="active">{t('download.active')}</SelectItem>
                    <SelectItem value="completed">{t('download.completed')}</SelectItem>
                    <SelectItem value="error">{t('download.error')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {availableSites.length > 0 && (
                <div className="space-y-2">
                  <Label>{t('dashboard.filters.site')}</Label>
                  <Select
                    value={localFilters.site}
                    onValueChange={(value) =>
                      setLocalFilters({
                        ...localFilters,
                        site: value
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('dashboard.filters.allSites')}</SelectItem>
                      {availableSites.map((site) => (
                        <SelectItem key={site} value={site}>
                          {site}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1">
                {t('dashboard.filters.apply')}
              </Button>
              <Button onClick={handleReset} variant="outline">
                {t('dashboard.filters.reset')}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
