import { useFormContext } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import { ProfileFormData } from '../../hooks/useProfileForm';

const OCCUPATIONS = [
  "Farmer / Agricultural Laborer",
  "Daily Wage Worker / Casual Laborer",
  "Street Vendor / Small Trader",
  "Student",
  "Homemaker",
  "Self-employed / Business",
  "Private Sector Employee",
  "Government Employee",
  "Unemployed",
  "Retired / Pensioner",
  "Other"
];

const INCOME_RANGES = [
  { label: "Less than ₹1,00,000", value: 50000 },
  { label: "₹1,00,000 - ₹2,50,000", value: 150000 },
  { label: "₹2,50,000 - ₹5,00,000", value: 350000 },
  { label: "₹5,00,000 - ₹8,00,000", value: 650000 },
  { label: "More than ₹8,00,000", value: 1000000 }
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Economic({ onNext, onBack }: Props) {
  const { register, formState: { errors } } = useFormContext<ProfileFormData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Briefcase size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Economic Profile</h2>
      </div>

      <div className="space-y-5">
        {/* Income */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Annual Household Income *</label>
          <select 
            {...register('income_annual', { valueAsNumber: true })}
            className={`w-full p-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.income_annual ? 'border-red-500' : 'border-slate-200'}`}
          >
            <option value="">Select income range...</option>
            {INCOME_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          {errors.income_annual && <p className="text-red-500 text-xs mt-1">{errors.income_annual.message}</p>}
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Occupation *</label>
          <select 
            {...register('occupation')}
            className={`w-full p-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.occupation ? 'border-red-500' : 'border-slate-200'}`}
          >
            <option value="">Select occupation...</option>
            {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
        </div>

        <div className="pt-2 space-y-3">
          {/* BPL Card */}
          <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              {...register('has_bpl_card')}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">I have a Below Poverty Line (BPL) Card / Antyodaya Anna Yojana (AAY) Card</span>
          </label>

          {/* Disability */}
          <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              {...register('is_disabled')}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">I am a Person with Disability (PwD)</span>
          </label>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 bg-slate-100 text-slate-700 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-200 focus:ring-4 focus:ring-slate-200 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-2/3 bg-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
