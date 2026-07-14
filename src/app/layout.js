import "./globals.css";
import { LanguageProvider } from '../components/LanguageContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: "ISSB Navigator - Premium Commission Preparation Platform",
  description: "Prepare for Pakistan Armed Forces (Army, Navy, Air Force) ISSB selection board. Real mock exams, psychological tests (WAT, TAT), physical fitness plans and officer interview simulator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-gold/30 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          {/* Subtle footer */}
          <footer className="py-6 text-center text-xs text-gray-500 border-t border-gold/10 mt-auto bg-black/40">
            <p>© {new Date().getFullYear()} ISSB Navigator. All Rights Reserved. Built for excellence & leadership preparation.</p>
            <p className="mt-1 text-[10px] text-gray-600 font-mono">Steer Your Path to Commission • Pakistan Armed Forces Prep Platform</p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
