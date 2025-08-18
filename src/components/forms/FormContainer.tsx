"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FormConfig } from '@/types/forms';

// Updated interface with optional wizard props
interface FormContainerProps {
  formConfig: FormConfig;
  isSubmitting: boolean;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  currentStep?: number;
  isWizard?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  formConfig,
  isSubmitting,
  children,
  onSubmit,
  isWizard = false,
  // other props...
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{formConfig.title}</h1>
        {formConfig.description && <p className="text-gray-600 mt-2">{formConfig.description}</p>}
      </div>

      {isWizard && (
        <div className="mb-8">{/* Future wizard step indicator UI */}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        <div className="mt-8 pt-5">
          <div className="flex justify-end">
            {isWizard ? (
              <>{/* Future wizard Next/Previous buttons */}</>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : (formConfig.submitButtonLabel || 'Submit')}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;