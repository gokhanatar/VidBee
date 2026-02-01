import type { PurchasesPackage } from '@revenuecat/purchases-capacitor'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { logger } from '../lib/logger'
import { isCapacitor } from '../lib/platform'
import {
  loadPremiumStatusAtom,
  premiumAtom,
  purchaseAtom,
  restoreAtom
} from '../store/premium'

export function useSubscriptionPremium() {
  const [premium] = useAtom(premiumAtom)
  const loadPremiumStatus = useSetAtom(loadPremiumStatusAtom)
  const doPurchase = useSetAtom(purchaseAtom)
  const doRestore = useSetAtom(restoreAtom)
  const { t } = useTranslation()

  useEffect(() => {
    if (isCapacitor()) {
      loadPremiumStatus()
    }
  }, [loadPremiumStatus])

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        await doPurchase(pkg)
        toast.success(t('premium.purchaseSuccess'))
      } catch (error) {
        logger.error('Purchase hook error:', error)
        toast.error(t('premium.purchaseFailed'))
      }
    },
    [doPurchase, t]
  )

  const restore = useCallback(async () => {
    try {
      await doRestore()
      toast.success(t('premium.restoreSuccess'))
    } catch (error) {
      logger.error('Restore hook error:', error)
      toast.error(t('premium.restoreFailed'))
    }
  }, [doRestore, t])

  return {
    isPremium: premium.isPremium,
    loading: premium.loading,
    offerings: premium.offerings,
    billingIssue: premium.billingIssue,
    purchase,
    restore
  }
}
