import { ExternalLink, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export interface SchemeCardProps {
  scheme_name: string;
  ministry: string;
  category: string;
  match_level: 'high' | 'medium' | 'low';
  reason: string;
  missing_criteria?: string[];
  apply_url?: string;
}

const matchConfig = {
  high: {
    label: 'High Match',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle2 size={16} className="mr-1" />
  },
  medium: {
    label: 'Medium Match',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: <AlertTriangle size={16} className="mr-1" />
  },
  low: {
    label: 'Low Match',
    bg: 'bg-red-100',
    text: 'text-red-600',
    icon: <AlertCircle size={16} className="mr-1" />
  }
};

export function SchemeCard({
  scheme_name,
  ministry,
  category,
  match_level,
  reason,
  missing_criteria = [],
  apply_url
}: SchemeCardProps) {
  const config = matchConfig[match_level];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-lg leading-snug">{scheme_name}</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">{ministry}</p>
        </div>
        <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text}`}>
          {config.icon}
          {config.label}
        </div>
      </div>

      <div className="mt-3">
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs rounded-full px-2.5 py-1 font-medium capitalize">
          {category ? category.replace('_', ' ') : 'General'}
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-4 leading-relaxed flex-1">
        {reason}
      </p>

      {missing_criteria.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">You may not qualify:</p>
          <div className="flex flex-wrap gap-2">
            {missing_criteria.map((criteria, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
                {criteria}
              </span>
            ))}
          </div>
        </div>
      )}

      {apply_url && (
        <a
          href={apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          View & Apply
          <ExternalLink size={16} className="ml-2" />
        </a>
      )}
    </div>
  );
}
