// import './globals.css';
// import Navbar  from './components/Navbar';
// import { Poppins, Noto_Sans_Malayalam } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const malayalam = Noto_Sans_Malayalam({
//   subsets: ["malayalam"],
//   weight: ["400", "500", "600", "700"],
// });

// export const metadata = {
//   title: 'Fatwa Navigator - Samastha Fatwas',
//   description: 'Explore Samastha Kerala fatwas with smart search, categories & recommendations',
//   icons: { icon: '/favicon.ico' },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body className={`${poppins.className} ${malayalam.className} min-h-screen flex flex-col`}>
//         {/* Sidebar / Navbar */}
//         {/* <Navbar /> */}
//         <main className="">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar"; // adjust path if needed

import { Poppins, Noto_Sans_Malayalam } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-malayalam",
  display: "swap",
});

export const metadata = {
  title: "Fatwa Navigator - Samastha Fatwas",
  description: "Explore Samastha Kerala fatwas with smart search, categories & recommendations",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ml"                
      dir="ltr"                    
      className={`${poppins.variable} ${malayalam.variable}`}
    >
      <body
        className="
          min-h-screen flex flex-col
          font-poppins antialiased "
      >
        {/* Optional: only show Navbar when needed */}
        <Navbar />

        <main className="flex-1 pt-16">
          {children}
        </main>

        {/* Optional footer or other global elements */}
      </body>
    </html>
  );
}