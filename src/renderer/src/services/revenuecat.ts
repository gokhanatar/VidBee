import { Capacitor } from '@capacitor/core'
import type { CustomerInfo, PurchasesOfferings, PurchasesPackage } from '@revenuecat/purchases-capacitor'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { ensureAuth } from '../lib/firebase'
import { logger } from '../lib/logger'

const ENTITLEMENT_ID = 'premium'

export async function initRevenueCat(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  const platform = Capacitor.getPlatform()
  const apiKey =
    platform === 'ios'
      ? import.meta.env.VITE_REVENUECAT_APPLE_API_KEY
      : import.meta.env.VITE_REVENUECAT_GOOGLE_API_KEY

  if (!apiKey) {
    logger.error('RevenueCat API key not configured for platform:', platform)
    return
  }

  await Purchases.configure({ apiKey })

  try {
    const user = await ensureAuth()
    await Purchases.logIn({ appUserID: user.uid })
  } catch (error) {
    logger.error('RevenueCat identify failed:', error)
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    const { offerings } = await Purchases.getOfferings()
    return offerings
  } catch (error) {
    logger.error('Failed to get offerings:', error)
    return null
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
    return customerInfo
  } catch (error) {
    logger.error('Purchase failed:', error)
    throw error
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.restorePurchases()
    return customerInfo
  } catch (error) {
    logger.error('Restore failed:', error)
    throw error
  }
}

export async function checkSubscription(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch (error) {
    logger.error('Subscription check failed:', error)
    return false
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    return customerInfo
  } catch (error) {
    logger.error('Failed to get customer info:', error)
    return null
  }
}

export async function logoutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut()
  } catch (error) {
    logger.error('RevenueCat logout failed:', error)
  }
}
