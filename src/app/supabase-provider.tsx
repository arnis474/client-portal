// src/app/supabase-provider.tsx
'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserClient } from '@supabase/ssr'
import { ReactNode, useMemo } from 'react'

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }, [])

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}
