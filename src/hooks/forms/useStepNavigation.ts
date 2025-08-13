import { useState, useCallback } from 'react';
import { FormConfig, Field } from '@/types/forms';

interface UseStepNavigationReturn {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  getCurrentStepFields: () => Field[];
  handleNext: (validateCurrentStep: () => boolean) => void;
  handlePrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

export const useStepNavigation = (formConfig: FormConfig): UseStepNavigationReturn => {
  const [currentStep, setCurrentStep] = useState(0);

  // Get current step fields
  const getCurrentStepFields = useCallback((): Field[] => {
    if (!formConfig.steps) return formConfig.fields;

    const currentStepConfig = formConfig.steps[currentStep];
    return formConfig.fields.filter(field =>
      currentStepConfig.fields.includes(field.name)
    );
  }, [formConfig, currentStep]);

  // Handle step navigation
  const handleNext = useCallback((validateCurrentStep: () => boolean) => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, (formConfig.steps?.length ?? 1) - 1));
    }
  }, [formConfig.steps]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const totalSteps = formConfig.steps?.length ?? 1;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    setCurrentStep,
    getCurrentStepFields,
    handleNext,
    handlePrevious,
    isFirstStep,
    isLastStep,
    totalSteps
  };
};