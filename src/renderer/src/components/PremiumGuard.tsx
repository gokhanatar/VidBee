import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { isCapacitor } from '../lib/platform'
import { premiumAtom } from '../store/premium'

interface PremiumGuardProps {
  children: ReactNode
  fallbackPath?: string
}

export function PremiumGuard({ children, fallbackPath = '/paywall' }: PremiumGuardProps) {
  const [premium] = useAtom(premiumAtom)

  if (!isCapacitor()) return <>{children}</>
  if (premium.loading) return null
  if (!premium.isPremium) return <Navigate to={fallbackPath} replace />

  return <>{children}</>
}
