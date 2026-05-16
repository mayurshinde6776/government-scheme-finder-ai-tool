import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { SchemeCard } from '../components/SchemeCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { SummaryBanner } from '../components/SummaryBanner';

interface EligibilityResult {
  scheme_id: string;
  scheme_name: string;
  ministry: string;
  category: string;
  match_level: 'high' | 'medium' | 'low';
  reason: string;
  missing_criteria: string[];
  apply_url: string;
}

interface ApiResponse {
  results: EligibilityResult[];
  total_found: number;
  query_time_ms: number;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('profile_id');
    if (!storedId) {
      navigate('/');
    } else {
      setProfileId(storedId);
    }
  }, [navigate]);

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['eligibility', profileId],
    queryFn: async () => {
      const res = await fetch('http://localhost:4000/api/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_id: profileId }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch eligible schemes');
      }
      return res.json();
    },
    enabled: !!profileId,
    retry: 0,
    staleTime: Infinity,
  });

  const categories = useMemo(() => {
    if (!data?.results) return [];
    const cats = new Set(data.results.map(r => r.category));
    return Array.from(cats).sort();
  }, [data]);

  const filteredResults = useMemo(() => {
    if (!data?.results) return [];
    if (selectedCategory === 'all') return data.results;
    return data.results.filter(r => r.category === selectedCategory);
  }, [data, selectedCategory]);

  if (!profileId) return null;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Eligible Schemes</h1>
          <p className="text-slate-500 mt-1">Review the programs you matched with.</p>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto mt-12">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-6">{error instanceof Error ? error.message : 'Unable to analyze eligibility.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-100 text-red-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-red-200 transition-colors"
          >
            Go Back & Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !isError && data && (
        <div className="space-y-6">
          <SummaryBanner count={data.total_found} />
          
          {data.total_found > 0 && (
            <>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelect={setSelectedCategory} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((scheme) => (
                  <SchemeCard
                    key={scheme.scheme_id}
                    scheme_name={scheme.scheme_name}
                    ministry={scheme.ministry || 'Government of India'}
                    category={scheme.category}
                    match_level={scheme.match_level}
                    reason={scheme.reason}
                    missing_criteria={scheme.missing_criteria}
                    apply_url={scheme.apply_url}
                  />
                ))}
              </div>
              
              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No schemes found for the selected category.</p>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 text-indigo-600 font-medium hover:underline"
                  >
                    View all categories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
