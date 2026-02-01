import { Capacitor } from '@capacitor/core'
import { logger } from './logger'

export async function bootstrapCapacitor(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    const { Keyboard } = await import('@capacitor/keyboard')
    const { App } = await import('@capacitor/app')

    // Status bar: transparent overlay
    await StatusBar.setStyle({ style: Style.Default })
    await StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {})

    // Keyboard: resize on show
    await Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {})

    // Android back button: go back or minimize
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        App.minimizeApp()
      }
    })

    // Hide splash after app is ready
    await SplashScreen.hide()

    logger.info('Capacitor bootstrap complete')
  } catch (error) {
    logger.error('Capacitor bootstrap failed:', error)
  }
}
