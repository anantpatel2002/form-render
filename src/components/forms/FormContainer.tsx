"use client"
import React from 'react';
import { ChevronLeft, ChevronRight, Check, CheckCircle } from 'lucide-react';
import { FormConfig } from '@/types/forms';
import { iconMap } from '@/constants/forms/icons';

interface FormContainerProps {
  formConfig: FormConfig;
  currentStep: number;
  isWizard: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
  isSubmitting: boolean;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  formConfig,
  currentStep,
  isWizard,
  isFirstStep,
  isLastStep,
  totalSteps,
  isSubmitting,
  children,
  onSubmit,
  onNext,
  onPrevious
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{formConfig.title}</h1>
        <p className="text-gray-600">{formConfig.description}</p>
      </div>

      {/* Step Navigation */}
      {isWizard && formConfig.steps && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {formConfig.steps.map((step, index) => {
                const StepIcon = iconMap[step.icon ?? "user"] || iconMap.user;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isActive ? 'bg-blue-500 border-blue-500 text-white' :
                      'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                    </div>

                    <div className="ml-3 min-w-0 flex-1">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 
                        isCompleted ? 'text-green-600' : 
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>

                    {index < totalSteps - 1 && (
                      <ChevronRight className="mx-4 text-gray-400" size={20} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Form Content */}
      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        {/* Form Navigation */}
        <div className="flex items-center justify-between pt-6">
          {isWizard ? (
            <>
              <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {formConfig.onSubmit?.loadingMessage || 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      {formConfig.submitButtonLabel || 'Submit'}
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              )}
            </>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {formConfig.onSubmit?.loadingMessage || 'Submitting...'}
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  {formConfig.submitButtonLabel || 'Submit'}
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormContainer;