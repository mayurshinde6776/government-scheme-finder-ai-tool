import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProfileForm from './components/ProfileForm';
import { ResultsPage } from './pages/ResultsPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Router>
          <Routes>
            <Route path="/" element={<ProfileForm />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Router>
      </main>
    </QueryClientProvider>
  );
}
