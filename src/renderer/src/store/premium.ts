import type { PurchasesOfferings, PurchasesPackage } from '@revenuecat/purchases-capacitor'
import { atom } from 'jotai'
import { logger } from '../lib/logger'
import {
  checkSubscription,
  getOfferings,
  purchasePackage,
  restorePurchases
} from '../services/revenuecat'

interface PremiumState {
  isPremium: boolean
  loading: boolean
  offerings: PurchasesOfferings | null
  billingIssue: boolean
}

export const premiumAtom = atom<PremiumState>({
  isPremium: false,
  loading: true,
  offerings: null,
  billingIssue: false
})

export const loadPremiumStatusAtom = atom(null, async (_get, set) => {
  set(premiumAtom, (prev) => ({ ...prev, loading: true }))
  try {
    const [isPremium, offerings] = await Promise.all([checkSubscription(), getOfferings()])
    set(premiumAtom, { isPremium, loading: false, offerings, billingIssue: false })
  } catch (error) {
    logger.error('Failed to load premium status:', error)
    set(premiumAtom, (prev) => ({ ...prev, loading: false }))
  }
})

export const purchaseAtom = atom(null, async (_get, set, pkg: PurchasesPackage) => {
  try {
    const customerInfo = await purchasePackage(pkg)
    if (customerInfo) {
      const isPremium = customerInfo.entitlements.active.premium !== undefined
      set(premiumAtom, (prev) => ({ ...prev, isPremium }))
    }
  } catch (error) {
    logger.error('Purchase failed:', error)
    throw error
  }
})

export const restoreAtom = atom(null, async (_get, set) => {
  try {
    const customerInfo = await restorePurchases()
    if (customerInfo) {
      const isPremium = customerInfo.entitlements.active.premium !== undefined
      set(premiumAtom, (prev) => ({ ...prev, isPremium }))
    }
  } catch (error) {
    logger.error('Restore failed:', error)
    throw error
  }
})

export const setBillingIssueAtom = atom(null, (_get, set, hasBillingIssue: boolean) => {
  set(premiumAtom, (prev) => ({ ...prev, billingIssue: hasBillingIssue }))
})

// --- Free tier limits ---
const FREE_DAILY_DOWNLOAD_LIMIT = 5
const FREE_MAX_VIDEO_HEIGHT = 720

const getDailyKey = () => `vdp_downloads_${new Date().toISOString().slice(0, 10)}`

export const dailyDownloadCountAtom = atom(0)

export const loadDailyCountAtom = atom(null, (_get, set) => {
  const count = Number.parseInt(localStorage.getItem(getDailyKey()) || '0', 10)
  set(dailyDownloadCountAtom, count)
})

export const incrementDailyCountAtom = atom(null, (_get, set) => {
  const key = getDailyKey()
  const current = Number.parseInt(localStorage.getItem(key) || '0', 10) + 1
  localStorage.setItem(key, String(current))
  set(dailyDownloadCountAtom, current)
})

export const canDownloadAtom = atom((get) => {
  const { isPremium } = get(premiumAtom)
  if (isPremium) return true
  return get(dailyDownloadCountAtom) < FREE_DAILY_DOWNLOAD_LIMIT
})

export const remainingDownloadsAtom = atom((get) => {
  const { isPremium } = get(premiumAtom)
  if (isPremium) return Infinity
  return Math.max(0, FREE_DAILY_DOWNLOAD_LIMIT - get(dailyDownloadCountAtom))
})

export const FREE_MAX_HEIGHT = FREE_MAX_VIDEO_HEIGHT
export const FREE_DAILY_LIMIT = FREE_DAILY_DOWNLOAD_LIMIT
