import { useState, useCallback } from 'react';
import { FormConfig, Field } from '@/types/forms';
import { getRootFields } from '@/utils/forms/field-helpers';

// The hook now accepts the TanStack Form instance
export const useStepNavigation = (form: any, formConfig: FormConfig) => {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepFields = useCallback((): Field[] => {
    if (!formConfig.steps) return formConfig.fields;
    const currentStepConfig = formConfig.steps[currentStep];
    return formConfig.fields.filter(field =>
      currentStepConfig.fields.includes(field.name)
    );
  }, [formConfig, currentStep])();

  const handleNext = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
   // 1. Use our new helper to get a flat list of all fields to validate.
    const fieldsToValidate = getRootFields(currentStepFields);
    console.log(fieldsToValidate);
    

    // 2. Trigger validation for all fields on the current step in parallel.
    await Promise.all(
      fieldsToValidate.map(field => form.validateField(field.name as any, 'change'))
    );

    // 3. Check for errors directly from the form's state.
    const hasErrors = fieldsToValidate.some(field => {
      const meta = form.getFieldMeta(field.name as any);
      return (meta?.errors?.length ?? 0) > 0;
    });
    
    // 4. Only proceed if there are no errors.
    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, (formConfig.steps?.length ?? 1) - 1));
    }
  }, [form, currentStepFields, formConfig.steps]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const totalSteps = formConfig.steps?.length ?? 1;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    currentStepFields,
    handleNext,
    handlePrevious,
    isFirstStep,
    isLastStep,
    totalSteps
  };
};