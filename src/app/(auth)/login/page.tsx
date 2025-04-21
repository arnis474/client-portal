'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Portal Login</h1>
          <p className="text-sm text-gray-500">Access your workspace or client portal</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF0000',             // Red Sign In button
                  brandAccent: '#CC0000',       // Red hover
                  inputBackground: '#FFFFFF',
                  inputText: '#000000',
                  inputBorder: '#D1D5DB',
                  inputLabelText: '#1f2937',
                },
              },
            },
            className: {
              button: 'rounded-md text-white w-full py-2 transition duration-200',
              input: 'bg-white border border-gray-300 text-black placeholder-gray-500 rounded-md',
              label: 'text-gray-800 mb-1',
              container: 'space-y-4',
              providerButton: 'bg-black hover:bg-neutral-900 text-white w-full py-2 rounded-md transition duration-200', // ✅ this forces Google to be black
            },
          }}
          theme="default"
          providers={['google']}
          showLinks={false}
        />

        <div className="text-sm mt-4 space-y-2 text-center">
          <a href="#" className="text-gray-500 hover:text-red-600 transition">Forgot your password?</a><br />
          <a href="#" className="text-gray-500 hover:text-red-600 transition">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  )
}
