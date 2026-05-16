import { Sparkles } from 'lucide-react';

interface Props {
  count: number;
}

export function SummaryBanner({ count }: Props) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center shadow-sm">
      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-4">
        <Sparkles size={20} />
      </div>
      <div>
        <h2 className="text-indigo-900 font-semibold">
          {count === 0 
            ? "We couldn't find any exact matches" 
            : `We found ${count} scheme${count === 1 ? '' : 's'} you may qualify for`}
        </h2>
        <p className="text-indigo-700 text-sm mt-0.5">
          Based on your profile, here are the most relevant government programs.
        </p>
      </div>
    </div>
  );
}
