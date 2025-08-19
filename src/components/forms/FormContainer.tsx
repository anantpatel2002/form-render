"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Check, CheckCircle } from 'lucide-react';
import { FormConfig } from '@/types/forms';
import { iconMap } from '@/constants/forms/icons';

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
  onNext?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPrevious?: () => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  formConfig,
  currentStep = 0,
  isWizard = false,
  isFirstStep = true,
  isLastStep = true,
  totalSteps = 1,
  isSubmitting,
  children,
  onSubmit,
  onNext,
  onPrevious
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{formConfig.title}</h1>
        <p className="text-gray-600">{formConfig.description}</p>
      </div>

      {isWizard && formConfig.steps && (
        <div className="mb-8">
          <ol className="flex items-center w-full">
            {formConfig.steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const IconComponent = iconMap[step.icon as keyof typeof iconMap] || CheckCircle;

              return (
                // <li key={step.id} className={`flex w-full items-center ${index < formConfig.steps!.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block" : ""}`}>
                //   <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${isCompleted ? 'bg-blue-600 text-white' : isCurrent ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                //     {isCompleted ? <Check size={20} /> : <IconComponent size={20} />}
                //   </span>
                // </li>

                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                      'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                    {isCompleted ? <CheckCircle size={20} /> : <IconComponent size={20} />}
                  </div>

                  <div className="ml-3 min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>

                  {index < (formConfig.steps?.length ?? 1) - 1 && (
                    <ChevronRight className="mx-4 text-gray-400" size={20} />
                  )}
                </div>
              );
            })}
          </ol>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {children}

        <div className="mt-8 pt-5 flex justify-between items-center">
          {isWizard ? (
            <>
              <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              {/* --- THIS IS THE FIX --- */}
              {/* Use a single button for both "Next" and "Submit" */}
              <button
                type={isLastStep ? 'submit' : 'button'}
                onClick={isLastStep ? undefined : onNext} // The 'onClick' now passes the event
                disabled={isLastStep ? isSubmitting : false}
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLastStep ? (
                  isSubmitting ? 'Submitting...' : (formConfig.submitButtonLabel || 'Submit')
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            </>
          ) : (
            // Non-wizard submit button (no changes)
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {formConfig.submitButtonLabel || 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


export default FormContainer;