import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: ' متجر مهد ونعناع ',
  description: 'متجر مهد ونعناع الإلكتروني المتكامل لمستلزمات المواليد والأطفال في اليمن بالريال السعودي، تحويل للصرافات وتأكيد عبر الواتساب وتتبع الطلبات.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className={`${tajawal.className} min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-slate-800 antialiased selection:bg-rose-500 selection:text-white`} suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
