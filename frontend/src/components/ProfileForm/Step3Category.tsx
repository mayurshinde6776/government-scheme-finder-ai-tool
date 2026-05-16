import { useFormContext } from 'react-hook-form';
import { Users, Loader2 } from 'lucide-react';
import { ProfileFormData } from '../../hooks/useProfileForm';

interface Props {
  onBack: () => void;
  onSubmit: (data: ProfileFormData) => void;
  isSubmitting: boolean;
}

export function Step3Category({ onBack, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors } } = useFormContext<ProfileFormData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Users size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Social Category</h2>
      </div>

      <div className="space-y-5">
        {/* Caste Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Caste / Social Category *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'general', label: 'General / Unreserved' },
              { id: 'obc', label: 'Other Backward Class (OBC)' },
              { id: 'sc', label: 'Scheduled Caste (SC)' },
              { id: 'st', label: 'Scheduled Tribe (ST)' }
            ].map((c) => (
              <label key={c.id} className="cursor-pointer">
                <input 
                  type="radio" 
                  value={c.id} 
                  {...register('caste_category')} 
                  className="peer sr-only" 
                />
                <div className="text-center p-4 rounded-xl border border-slate-200 bg-slate-50 peer-checked:bg-indigo-50 peer-checked:border-indigo-600 peer-checked:text-indigo-700 transition-all font-medium text-sm text-slate-600 hover:bg-slate-100">
                  {c.label}
                </div>
              </label>
            ))}
          </div>
          {errors.caste_category && <p className="text-red-500 text-xs mt-2">{errors.caste_category.message}</p>}
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
          <p className="text-sm text-blue-800">
            <strong>Privacy Note:</strong> Your information is used strictly to match you with eligible government schemes. No data is shared with third parties.
          </p>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-1/3 bg-slate-100 text-slate-700 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-200 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-2/3 bg-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Finding Schemes...
            </>
          ) : (
            'Check Eligibility'
          )}
        </button>
      </div>
    </div>
  );
}
