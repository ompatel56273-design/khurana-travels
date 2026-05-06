import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Khurana Travels — Premium Bus Travel Across India',
  description:
    'Book premium bus tours across India with Khurana Travels. Explore iconic destinations like the Golden Triangle, Manali, Rajasthan, and more. Comfortable AC buses, handpicked routes, and unforgettable experiences.',
  keywords: 'bus travel, tour packages, India travel, Khurana Travels, bus booking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-[var(--font-inter)] antialiased">
        <AuthProvider>
          <BookingProvider>
            <SmoothScroll>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </SmoothScroll>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1a1a2e',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: { primary: '#00c9a7', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ff4757', secondary: '#fff' },
                },
              }}
            />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
