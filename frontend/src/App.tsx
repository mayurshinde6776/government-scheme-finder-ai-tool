import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileForm from './components/ProfileForm';

function ResultsPlaceholder() {
  return (
    <div className="max-w-lg mx-auto w-full px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900">Your Results</h1>
      <p className="mt-4 text-slate-600">Your profile has been saved and your eligible schemes are being retrieved.</p>
    </div>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<ProfileForm />} />
          <Route path="/results" element={<ResultsPlaceholder />} />
        </Routes>
      </Router>
    </main>
  );
}
