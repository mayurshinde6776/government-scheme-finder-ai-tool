import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="bg-indigo-50 p-6 rounded-full mb-6">
        <FileQuestion size={48} className="text-indigo-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Page Not Found</h1>
      <p className="text-slate-500 text-lg mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        to="/" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
