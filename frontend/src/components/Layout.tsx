import { Outlet, Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
              <Landmark size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">SchemeFinder</span>
          </Link>
          
          <nav className="hidden sm:flex gap-6 font-medium text-sm text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/check" className="hover:text-indigo-600 transition-colors">Check Eligibility</Link>
            <Link to="/" className="hover:text-indigo-600 transition-colors">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Landmark size={18} className="text-indigo-500" />
            <span className="font-semibold text-base">SchemeFinder</span>
          </div>
          <p className="mt-2">Connecting citizens with the right government programs.</p>
          <p className="mt-4 text-xs text-slate-500">© {new Date().getFullYear()} SchemeFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
