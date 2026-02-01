import { useAtom } from 'jotai'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isCapacitor } from '../lib/platform'
import { premiumAtom } from '../store/premium'

export function BillingIssueBanner() {
  const [premium] = useAtom(premiumAtom)
  const { t } = useTranslation()

  if (!isCapacitor() || !premium.billingIssue) return null

  return (
    <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mx-4 mt-2">
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-destructive">{t('premium.billingIssueTitle')}</p>
        <p className="text-xs text-muted-foreground">{t('premium.billingIssueDescription')}</p>
      </div>
    </div>
  )
}
