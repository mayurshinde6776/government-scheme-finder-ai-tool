import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

export const profileSchema = z.object({
  state: z.string().min(1, 'State is required'),
  age: z.number({ message: 'Age must be a number' }).int().min(18, 'Minimum age is 18').max(130, 'Maximum age is 130'),
  gender: z.enum(['male', 'female', 'other']),
  caste_category: z.enum(['general', 'obc', 'sc', 'st']),
  income_annual: z.number({ message: 'Income must be a number' }).int().min(0, 'Income cannot be negative'),
  occupation: z.string().min(1, 'Occupation is required'),
  is_disabled: z.boolean(),
  has_bpl_card: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      state: '',
      age: undefined,
      gender: undefined,
      caste_category: undefined,
      income_annual: undefined,
      occupation: '',
      is_disabled: false,
      has_bpl_card: false,
    },
    mode: 'onTouched',
  });

  const { trigger } = methods;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['state', 'age', 'gender'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['income_annual', 'occupation'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitForm = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit profile');
      }

      const result = await response.json();
      
      // Store in local storage
      localStorage.setItem('profile_id', result.profile_id);
      localStorage.setItem('profile_data', JSON.stringify(data));

      navigate('/results');
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    currentStep,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting
  };
}
