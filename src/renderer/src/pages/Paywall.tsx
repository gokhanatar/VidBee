import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'
import { useSubscriptionPremium } from '@renderer/hooks/use-subscription-premium'
import { Check, Crown, Loader2, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Paywall() {
  const { t } = useTranslation()
  const { offerings, loading, purchase, restore, isPremium } = useSubscriptionPremium()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <Crown className="h-12 w-12 text-yellow-500" />
        <p className="text-lg font-semibold">{t('premium.alreadyPremium')}</p>
      </div>
    )
  }

  const currentOffering = offerings?.current
  const packages = currentOffering?.availablePackages ?? []

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="text-center">
        <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">{t('premium.title')}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t('premium.subtitle')}</p>
      </div>

      <div className="space-y-3">
        {(['feature1', 'feature2', 'feature3', 'feature4'] as const).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-sm">{t(`premium.features.${key}`)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        {packages.map((pkg) => (
          <Card key={pkg.identifier} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{pkg.product.title}</p>
                <p className="text-sm text-muted-foreground">{pkg.product.description}</p>
              </div>
              <Badge variant="secondary">{pkg.product.priceString}</Badge>
            </div>
            <Button className="w-full mt-3" onClick={() => purchase(pkg)}>
              {t('premium.subscribe')}
            </Button>
          </Card>
        ))}
      </div>

      <Button variant="ghost" className="w-full" onClick={restore}>
        <RotateCcw className="h-4 w-4 mr-2" />
        {t('premium.restore')}
      </Button>

      <div className="text-center text-xs text-muted-foreground space-x-2">
        <a href="https://viddownloadpro.org/terms" target="_blank" rel="noreferrer" className="underline">
          {t('premium.terms')}
        </a>
        <span>|</span>
        <a href="https://viddownloadpro.org/privacy" target="_blank" rel="noreferrer" className="underline">
          {t('premium.privacy')}
        </a>
      </div>
    </div>
  )
}
