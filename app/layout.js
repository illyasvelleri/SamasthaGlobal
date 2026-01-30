import './globals.css';
import { Navbar } from './components/Navbar';
import { Poppins, Noto_Sans_Malayalam } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: 'Fatwa Navigator - Samastha Fatwas',
  description: 'Explore Samastha Kerala fatwas with smart search, categories & recommendations',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml" dir="rtl">
      <body className={`${poppins.className} ${malayalam.className} min-h-screen flex flex-col`}>
        {/* <Navbar /> */}
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
