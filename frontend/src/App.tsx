import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { ProfileFormPage } from './pages/ProfileFormPage';
import { ResultsPage } from './pages/ResultsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="check" element={<ProfileFormPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}
