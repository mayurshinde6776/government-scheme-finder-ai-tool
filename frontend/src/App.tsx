import { useEffect, useState } from 'react';

type Health = {
  status: string;
  database?: string;
  pgvector?: boolean;
  error?: string;
};

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch((err) => setHealth({ status: 'error', error: String(err) }));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">
          Government Scheme Finder
        </h1>
        <p className="mt-3 text-slate-600">
          AI-powered search across government schemes.
        </p>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Backend health</h2>
          <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-4 text-sm text-slate-100">
            {health ? JSON.stringify(health, null, 2) : 'Loading…'}
          </pre>
        </section>
      </div>
    </main>
  );
}
