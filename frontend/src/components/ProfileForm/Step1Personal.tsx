import { useFormContext } from 'react-hook-form';
import { User } from 'lucide-react';
import { ProfileFormData } from '../../hooks/useProfileForm';

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Lakshadweep", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

interface Props {
  onNext: () => void;
}

export function Step1Personal({ onNext }: Props) {
  const { register, formState: { errors } } = useFormContext<ProfileFormData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <User size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Personal Details</h2>
      </div>

      <div className="space-y-5">
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State/UT of Residence *</label>
          <select 
            {...register('state')}
            className={`w-full p-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.state ? 'border-red-500' : 'border-slate-200'}`}
          >
            <option value="">Select your state...</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
          <input 
            type="number" 
            {...register('age', { valueAsNumber: true })}
            className={`w-full p-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.age ? 'border-red-500' : 'border-slate-200'}`}
            placeholder="e.g. 34"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
          <div className="grid grid-cols-3 gap-3">
            {['male', 'female', 'other'].map((g) => (
              <label key={g} className="cursor-pointer">
                <input 
                  type="radio" 
                  value={g} 
                  {...register('gender')} 
                  className="peer sr-only" 
                />
                <div className="text-center p-3 rounded-xl border border-slate-200 bg-slate-50 peer-checked:bg-indigo-50 peer-checked:border-indigo-600 peer-checked:text-indigo-700 transition-all font-medium capitalize text-sm text-slate-600">
                  {g}
                </div>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
