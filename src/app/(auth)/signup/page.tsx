'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase'; // Assuming your Supabase client setup is here
import Image from 'next/image'; // Use Next.js Image component for optimization
import Link from 'next/link'; // Use Next.js Link for navigation

export default function SignupPageV3() {
  // --- State for potential custom elements (if not using Auth UI directly) ---
  // const [isLoading, setIsLoading] = useState(false);
  // const [formError, setFormError] = useState<string | null>(null);

  return (
    // Changed background to dark gray for glow visibility, added padding
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Card container with V3 styling */}
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md space-y-6 border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.4)]"> {/* Added V3 styles: rounding, shadow, border, glow */}

        {/* 1. Branding */}
        <div className="text-center space-y-3">
           {/* Logo */}
           <Image
              src="/roseyco_logo.svg" // *** REPLACE with your logo path in /public ***
              alt="Company Logo"
              width={120} // Adjust width as needed
              height={40} // Adjust height as needed
              className="mx-auto h-10 w-auto"
              priority
              onError={(e) => { console.error('Logo failed to load'); (e.target as HTMLImageElement).style.display = 'none'; }}
           />
           {/* Optional Tagline */}
           <p className="text-sm text-gray-500">Powering local business growth</p>
        </div>

        {/* Signup Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Create Account</h1> {/* Matched styling */}
          <p className="text-sm text-gray-500 mt-1">Sign up to access your client portal</p>
        </div>

        {/* Supabase Auth Component - with V3 appearance */}
        <Auth
          supabaseClient={supabase}
          view="sign_up" // Specify the sign_up view
          appearance={{
            theme: ThemeSupa, // Base theme
            variables: { // Copied V3 variables from login page
              default: {
                colors: {
                  brand: '#DC2626',
                  brandAccent: '#B91C1C',
                  brandButtonText: 'white',
                  defaultButtonBackground: 'black',
                  defaultButtonBackgroundHover: '#1f2937',
                  defaultButtonBorder: 'black',
                  defaultButtonText: 'white',
                  inputBackground: '#FFFFFF',
                  inputText: '#000000',
                  inputBorder: '#D1D5DB',
                  inputBorderHover: '#9CA3AF',
                  inputBorderFocus: '#F87171',
                  inputLabelText: '#1f2937',
                  inputPlaceholder: '#6B7280',
                  messageText: '#4B5563',
                  messageTextDanger: '#DC2626',
                  anchorTextColor: '#4B5563',
                  anchorTextColorHover: '#DC2626',
                },
                radii: {
                    borderRadiusButton: '0.375rem',
                    inputBorderRadius: '0.375rem',
                },
                space: {
                    spaceLarge: '1.5rem',
                    spaceMedium: '1rem',
                    spaceSmall: '0.5rem',
                    inputPadding: '0.625rem 0.875rem',
                    buttonPadding: '0.625rem 1rem',
                },
                // fonts: { /* Add custom fonts if needed */ },
              },
            },
            className: { // Copied V3 classNames from login page
              container: 'space-y-6',
              button: 'transition duration-200 ease-in-out flex items-center justify-center gap-2',
              input: 'transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 focus:border-transparent',
              label: 'text-sm font-medium text-gray-800 mb-1 block',
              message: 'text-sm mt-2',
              providerButton: 'transition duration-200 ease-in-out flex items-center justify-center gap-2 !bg-black hover:!bg-neutral-800 !text-white !border-black',
              divider: 'text-xs text-gray-400',
            },
          }}
          theme="default" // Use the variable overrides
          providers={['google']} // Only show Google provider for signup too
          providerScopes={{ google: 'email profile' }}
          socialLayout="horizontal"
          showLinks={false} // Hide default links to use custom one below
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`} // Ensure redirect URL is set
        />

        {/* Custom Links Area */}
        <div className="text-sm text-center pt-4 border-t border-gray-200"> {/* Added padding top and border */}
          <Link href="/login" className="font-medium text-gray-600 hover:text-red-600 transition duration-150 ease-in-out"> {/* Use Next.js Link, adjust href as needed */}
            Already have an account? Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
