import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-200 z-10
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : isCompleted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }
                `}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step}
              </div>
            </div>

            {/* Connecting Line */}
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                  isCompleted ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
