import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import 'antd-mobile/es/global';
import Script from 'next/script';
import ReduxProvider from '../modules/providers/ReduxProvider';
import SocketProvider from '@/components/SocketProvider';
import AuthProvider from '@/components/AuthProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';
 
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  userScalable: 'no',
  maximumScale: 1.0,
  themeColor: '#3b82f6',
}

export const metadata: Metadata = {
  title: 'Stter Admin Panel - Telegram Rewards App',
  description: 'Complete tasks and earn up to $100 in pts coins in this Telegram mini app',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Stter Admin Panel',
    title: 'Stter Admin Panel - Telegram Rewards App',
    description: 'Complete tasks and earn up to $100 in pts coins',
  },
  twitter: {
    card: 'summary',
    title: 'Stter Admin Panel - Telegram Rewards App',
    description: 'Complete tasks and earn up to $100 in pts coins',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"  >
      <head>
        
      </head>
      <body className={`${poppins.variable} font-sans bg-gray-50 dark:bg-gray-900`}  >
 
          <AuthProvider>
            <ReduxProvider>
              <SocketProvider>
                <div id="root" className="">
                  {children}
                </div>
             
              </SocketProvider>
            </ReduxProvider>
          </AuthProvider>
   
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
         <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
          />

<SpeedInsights />
          
      </body>
    </html>
  )
}
