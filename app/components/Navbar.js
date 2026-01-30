'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Bot, BookOpen } from 'lucide-react';

const menuItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bot', href: '/bot', icon: Bot },
  { label: 'Fatwa', href: '/fatwa', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ✅ Mobile Bottom Navigation (unchanged) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-black text-white py-3 rounded-t-3xl shadow-2xl border-t border-gray-800/30"
      >
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center text-xs font-medium transition-all ${
              isActive(item.href) ? 'text-white' : 'text-white/60'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-xl transition-all ${
                isActive(item.href) ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <item.icon className="h-6 w-6" />
            </motion.div>
            <span className="mt-1 text-[10px]">{item.label}</span>

            {isActive(item.href) && (
              <motion.div
                layoutId="mobileIndicator"
                className="absolute -bottom-1 w-10 h-1 bg-white rounded-full"
              />
            )}
          </Link>
        ))}
      </motion.div>

      {/* ✅ Desktop Top Navbar (NEW) */}
      <div className="hidden sm:flex fixed top-0 left-0 right-0 z-50 px-10 py-6 backdrop-blur-md">
        <div className="flex items-center justify-center gap-12 mx-auto">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="relative group">
              <motion.span
                whileHover={{ y: -2 }}
                className={`text-sm tracking-wide transition-all ${
                  isActive(item.href)
                    ? 'text-green-600 font-semibold'
                    : 'text-green/60 group-hover:text-white'
                }`}
              >
                {item.label}
              </motion.span>

              {/* Animated underline */}
              <motion.div
                className="absolute left-0 -bottom-1 h-[2px] bg-white rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={
                  isActive(item.href)
                    ? { width: '100%', opacity: 1 }
                    : { width: 0, opacity: 0 }
                }
                transition={{ duration: 0.3 }}
              />

              {/* Glow effect */}
              {isActive(item.href) && (
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-[6px] bg-white/20 blur-md"
                  layoutId="desktopGlow"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
