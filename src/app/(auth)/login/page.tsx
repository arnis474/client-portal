'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase'; // Assuming your Supabase client setup is here
import Image from 'next/image'; // Use Next.js Image component for optimization

// Optional: Import icons if needed for custom elements not handled by Auth UI
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPageV3() {
  // --- State for potential custom elements (if not using Auth UI directly) ---
  // const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Card container with V3 styling - UPDATED border width and shadow spread */}
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md space-y-6 border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.4)]"> {/* Changed to border-2 and increased shadow spread/adjusted opacity */}

        {/* 1. Branding */}
        <div className="text-center space-y-3">
           {/* Logo */}
           <Image
              src="/roseyco_logo.svg" // *** REPLACE with your logo path in /public ***
              alt="Company Logo"
              width={120} // Adjust width as needed
              height={40} // Adjust height as needed
              className="mx-auto h-10 w-auto" // Adjust size with h-* class if preferred over width/height props
              priority // Prioritize loading the logo
              onError={(e) => { console.error('Logo failed to load'); (e.target as HTMLImageElement).style.display = 'none'; }}
           />
           {/* Optional Tagline */}
           <p className="text-sm text-gray-500">Powering local business growth</p> {/* Example Tagline */}
        </div>

        {/* Login Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Portal Login</h1> {/* Slightly smaller header */}
          <p className="text-sm text-gray-500 mt-1">Access your workspace or client portal</p>
        </div>

        {/* Supabase Auth Component */}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa, // Base theme
            variables: {
              default: {
                colors: {
                  brand: '#DC2626',           // Red-600 for primary button
                  brandAccent: '#B91C1C',    // Red-700 for hover
                  brandButtonText: 'white', // Ensure text is white on brand color
                  defaultButtonBackground: 'black',
                  defaultButtonBackgroundHover: '#1f2937', // Neutral-800 for Google hover
                  defaultButtonBorder: 'black',
                  defaultButtonText: 'white',
                  inputBackground: '#FFFFFF',
                  inputText: '#000000',
                  inputBorder: '#D1D5DB',      // Gray-300
                  inputBorderHover: '#9CA3AF', // Gray-400
                  inputBorderFocus: '#F87171', // Red-400 for focus ring (adjust as needed)
                  inputLabelText: '#1f2937',   // Gray-800
                  inputPlaceholder: '#6B7280', // Gray-500
                  messageText: '#4B5563',      // Gray-600 for messages
                  messageTextDanger: '#DC2626', // Red-600 for errors (Supabase UI default errors)
                  anchorTextColor: '#4B5563',      // Gray-600 for links like "Forgot password?"
                  anchorTextColorHover: '#DC2626', // Red-600 for link hover
                },
                radii: { // Apply consistent rounding
                    borderRadiusButton: '0.375rem', // rounded-md
                    inputBorderRadius: '0.375rem', // rounded-md
                },
                space: { // Adjust spacing if needed
                    spaceLarge: '1.5rem', // space-y-6
                    spaceMedium: '1rem', // space-y-4
                    spaceSmall: '0.5rem', // space-y-2
                    inputPadding: '0.625rem 0.875rem', // Adjust input padding (py-2.5 px-3.5 approx)
                    buttonPadding: '0.625rem 1rem', // Adjust button padding (py-2.5 px-4 approx)
                },
                // fonts: { // Uncomment to customize fonts
                //   bodyFontFamily: `Inter, sans-serif`,
                //   buttonFontFamily: `Inter, sans-serif`,
                //   inputFontFamily: `Inter, sans-serif`,
                //   labelFontFamily: `Inter, sans-serif`,
                // },
              },
            },
            // ClassName overrides for finer control & Tailwind utility application
            className: {
              container: 'space-y-6', // Match container spacing
              button: 'transition duration-200 ease-in-out flex items-center justify-center gap-2', // Base button styles + transition + flex for potential icon/spinner
              input: 'transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 focus:border-transparent', // Added focus ring + transition
              label: 'text-sm font-medium text-gray-800 mb-1 block', // Ensure label is block
              message: 'text-sm mt-2', // Base message styles
              // Provider button specifically for Google (and others)
              // Note: The text "Sign in with Google" is usually added by the Auth component itself.
              providerButton: 'transition duration-200 ease-in-out flex items-center justify-center gap-2 !bg-black hover:!bg-neutral-800 !text-white !border-black', // Overriding Supabase theme styles for Google button
              // anchor: 'text-sm font-medium', // Already handled by variables, but can override here
              divider: 'text-xs text-gray-400',
            },
          }}
          theme="default" // Use the variable overrides defined above
          providers={['google']} // Only show Google provider
          providerScopes={{ // Request specific Google scopes if needed
            google: 'email profile',
          }}
          socialLayout="horizontal" // Display providers horizontally if multiple were present
          // --- Features NOT easily added via Auth UI ---
          // showLinks={true} // Set to true to show default "Forgot Password", "Sign Up" links from Auth UI
          // localization={{ // Example for customizing text
          //   variables: { sign_in: { email_label: 'Your Email Address', password_label: 'Your Password', social_provider_text: 'Sign in with {{provider}}' } } // Might control provider text
          // }}
          // --- Features requiring custom form build ---
          // - Inline validation messages below fields
          // - Password visibility toggle
          // - "Remember Me" checkbox
          // - Custom loading spinner *inside* the button
          showLinks={false} // Hide default links to use custom ones below
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`} // Ensure redirect URL is set
        />

        {/* Custom Links Area */}
        <div className="text-sm space-y-2 text-center pt-4 border-t border-gray-200"> {/* Added padding top and border */}
          <a href="#" className="font-medium text-gray-600 hover:text-red-600 transition duration-150 ease-in-out block">
            Forgot your password?
          </a>
          <a href="#" className="font-medium text-gray-600 hover:text-red-600 transition duration-150 ease-in-out block">
            Don't have an account? Sign up
          </a>
        </div>

      </div>
    </div>
  );
}
