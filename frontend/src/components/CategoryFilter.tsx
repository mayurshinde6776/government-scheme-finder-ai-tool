interface Props {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: Props) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex space-x-2 border-b border-slate-200 px-1">
        <button
          onClick={() => onSelect('all')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
            selectedCategory === 'all'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] capitalize ${
              selectedCategory === cat
                ? 'text-indigo-600 border-indigo-600'
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat ? cat.replace('_', ' ') : 'General'}
          </button>
        ))}
      </div>
    </div>
  );
}
