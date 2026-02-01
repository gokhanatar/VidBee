# RevenueCat Integration Guide

> Capacitor + React + Supabase + RevenueCat tam entegrasyon.
> **ZORUNLU:** Refund & Cancellation sistemi (Section 7) bu entegrasyonun ayrılmaz parçasıdır.
> Refundsız RevenueCat kurulumu eksik kabul edilir. Section 1-8 komple uygulanmalıdır.

## 1. Kurulum

### Package
```bash
npm install @revenuecat/purchases-capacitor
npx cap sync
```

### RevenueCat Dashboard
1. https://app.revenuecat.com → Yeni proje oluştur
2. iOS app ekle → App Store Connect'ten Bundle ID gir
3. Android app ekle → Play Console'dan Package Name gir
4. API Keys al:
   - iOS: `appl_xxxxx`
   - Android: `goog_xxxxx`

### Environment Variables
```env
VITE_REVENUECAT_IOS_KEY=appl_xxxxx
VITE_REVENUECAT_ANDROID_KEY=goog_xxxxx
```

## 2. Service Dosyası

```typescript
// src/services/revenuecat.ts
import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const API_KEY = Capacitor.getPlatform() === 'ios'
  ? import.meta.env.VITE_REVENUECAT_IOS_KEY
  : import.meta.env.VITE_REVENUECAT_ANDROID_KEY;

export async function initRevenueCat(userId?: string) {
  if (!Capacitor.isNativePlatform()) return;

  await Purchases.configure({
    apiKey: API_KEY,
    appUserID: userId ?? undefined,
  });

  if (import.meta.env.DEV) {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
  }
}

export async function getOfferings() {
  const { offerings } = await Purchases.getOfferings();
  return offerings?.current ?? null;
}

export async function purchasePackage(packageToPurchase: any) {
  try {
    const { customerInfo } = await Purchases.purchasePackage({
      aPackage: packageToPurchase,
    });
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return { success: false, cancelled: true };
    }
    throw error;
  }
}

export async function restorePurchases() {
  const { customerInfo } = await Purchases.restorePurchases();
  return customerInfo;
}

export async function checkSubscription(entitlementId: string = 'premium') {
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active[entitlementId] !== undefined;
}

export async function identifyUser(userId: string) {
  await Purchases.logIn({ appUserID: userId });
}

export async function logoutRevenueCat() {
  await Purchases.logOut();
}
```

## 3. React Hook

```typescript
// src/hooks/useSubscription.ts
import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  checkSubscription,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '@/services/revenuecat';

export function useSubscription(entitlementId = 'premium') {
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setLoading(false);
      return;
    }

    async function check() {
      try {
        const [active, offers] = await Promise.all([
          checkSubscription(entitlementId),
          getOfferings(),
        ]);
        setIsPremium(active);
        setOfferings(offers);
      } catch {
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [entitlementId]);

  const purchase = useCallback(async (pkg: any) => {
    const result = await purchasePackage(pkg);
    if (result.success) {
      setIsPremium(true);
    }
    return result;
  }, []);

  const restore = useCallback(async () => {
    const info = await restorePurchases();
    const active = info.entitlements.active[entitlementId] !== undefined;
    setIsPremium(active);
    return active;
  }, [entitlementId]);

  return { isPremium, offerings, loading, purchase, restore };
}
```

## 4. App.tsx Entegrasyonu

```typescript
// App.tsx içinde, auth state değiştiğinde:
import { initRevenueCat, identifyUser, logoutRevenueCat } from '@/services/revenuecat';

// App mount'ta:
useEffect(() => {
  initRevenueCat();
}, []);

// Auth state change'de:
useEffect(() => {
  if (user) {
    identifyUser(user.id);
  } else {
    logoutRevenueCat();
  }
}, [user]);
```

## 5. Paywall Sayfası Kontrol Listesi

- [ ] Tüm paketler (monthly, yearly, lifetime) gösteriliyor
- [ ] Fiyatlar yerel para biriminde
- [ ] "Restore Purchases" butonu var (Apple zorunlu)
- [ ] Terms of Service linki var
- [ ] Privacy Policy linki var
- [ ] Satın alma sonrası premium state güncelleniyor
- [ ] Loading state satın alma sırasında
- [ ] Error handling (cancelled, failed, network)
- [ ] Introductory offer / free trial gösterimi

## 6. Supabase Webhook (Opsiyonel)

RevenueCat → Supabase webhook ile subscription status sync:

```sql
-- Supabase: subscriptions table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  revenuecat_id text,
  entitlement text,
  is_active boolean default false,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);
```

RevenueCat Dashboard → Integrations → Webhooks → Supabase Edge Function URL ekle.

## 7. Refund & Cancellation Handling

### 7a. RevenueCat Webhook Events

RevenueCat şu event'leri gönderir — Edge Function'da handle et:

| Event | Açıklama | Aksiyon |
|-------|----------|---------|
| `INITIAL_PURCHASE` | İlk satın alma | Erişim aç |
| `RENEWAL` | Otomatik yenileme | Erişimi uzat |
| `CANCELLATION` | İptal (refund dahil) | Erişimi kapat |
| `UNCANCELLATION` | İptal geri alındı | Erişim devam |
| `BILLING_ISSUE` | Ödeme sorunu | Kullanıcıyı uyar |
| `SUBSCRIBER_ALIAS` | Kullanıcı birleşti | ID güncelle |
| `EXPIRATION` | Abonelik bitti | Erişimi kapat |
| `PRODUCT_CHANGE` | Plan değişikliği | Yeni plan uygula |

### 7b. Supabase Edge Function — Webhook Handler

```typescript
// supabase/functions/revenuecat-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WEBHOOK_AUTH_KEY = Deno.env.get('REVENUECAT_WEBHOOK_KEY');

serve(async (req) => {
  // Auth check
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${WEBHOOK_AUTH_KEY}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const event = body.event;
  const appUserId = event.app_user_id;
  const type = event.type;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  switch (type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: appUserId,
          revenuecat_id: event.original_transaction_id,
          entitlement: event.entitlement_ids?.[0] ?? 'premium',
          is_active: true,
          expires_at: event.expiration_at_ms
            ? new Date(event.expiration_at_ms).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      break;

    case 'CANCELLATION':
    case 'EXPIRATION': {
      // Refund veya süre dolumu → erişimi kapat
      const isRefund = event.cancel_reason === 'CUSTOMER_SUPPORT'
        || event.cancel_reason === 'UNSUBSCRIBE';

      await supabase
        .from('subscriptions')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', appUserId);

      // Refund ise ayrıca logla
      if (isRefund) {
        await supabase
          .from('refund_logs')
          .insert({
            user_id: appUserId,
            reason: event.cancel_reason,
            original_transaction_id: event.original_transaction_id,
            refund_at: new Date().toISOString(),
          });
      }
      break;
    }

    case 'BILLING_ISSUE':
      await supabase
        .from('subscriptions')
        .update({
          billing_issue: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', appUserId);
      break;

    case 'PRODUCT_CHANGE':
      await supabase
        .from('subscriptions')
        .update({
          entitlement: event.new_product_id,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', appUserId);
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
```

### 7c. Refund Logs Table

```sql
-- Supabase: refund tracking
create table public.refund_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  reason text,
  original_transaction_id text,
  refund_at timestamptz default now()
);

alter table public.refund_logs enable row level security;

create policy "Users read own refunds"
  on public.refund_logs for select
  using (auth.uid() = user_id);
```

### 7d. Subscriptions Table Update

Mevcut `subscriptions` tablosuna `billing_issue` kolonu ekle:
```sql
alter table public.subscriptions
  add column if not exists billing_issue boolean default false;
```

### 7e. Frontend — Billing Issue Banner

```typescript
// src/components/BillingIssueBanner.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function BillingIssueBanner() {
  const { data: hasBillingIssue } = useQuery({
    queryKey: ['billing-issue'],
    queryFn: async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('billing_issue')
        .single();
      return data?.billing_issue ?? false;
    },
  });

  if (!hasBillingIssue) return null;

  return (
    <Alert variant="destructive" className="mx-4 mt-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Ödeme sorunu tespit edildi. Lütfen ödeme yönteminizi güncelleyin.
      </AlertDescription>
    </Alert>
  );
}
```

### 7f. RevenueCat Dashboard Webhook Ayarı

1. RevenueCat → Project → Integrations → Webhooks
2. URL: `https://<your-project>.supabase.co/functions/v1/revenuecat-webhook`
3. Authorization Header: `Bearer <REVENUECAT_WEBHOOK_KEY>`
4. Events: Tümünü seç (INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, BILLING_ISSUE, PRODUCT_CHANGE, UNCANCELLATION)
5. Test: "Send Test Event" ile doğrula

---

## 8. Test Ortamı

- iOS: Sandbox tester (App Store Connect → Users → Sandbox)
- Android: License testing (Play Console → Setup → License Testing)
- RevenueCat Dashboard → Sandbox mode aktif
- Test ederken `setLogLevel(DEBUG)` kullan
