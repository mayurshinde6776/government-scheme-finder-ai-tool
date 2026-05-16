import { FormProvider } from 'react-hook-form';
import { useProfileForm } from '../../hooks/useProfileForm';
import { StepIndicator } from '../StepIndicator';
import { Step1Personal } from './Step1Personal';
import { Step2Economic } from './Step2Economic';
import { Step3Category } from './Step3Category';

export default function ProfileForm() {
  const { 
    methods, 
    currentStep, 
    nextStep, 
    prevStep, 
    submitForm, 
    isSubmitting 
  } = useProfileForm();

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Eligible Schemes</h1>
        <p className="text-slate-500 mt-2">Fill out your profile to find government schemes tailored for you.</p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <Step1Personal onNext={nextStep} />}
            {currentStep === 2 && <Step2Economic onNext={nextStep} onBack={prevStep} />}
            {currentStep === 3 && (
              <Step3Category 
                onBack={prevStep} 
                onSubmit={submitForm} 
                isSubmitting={isSubmitting} 
              />
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
