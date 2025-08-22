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

    // 1. Get the current form values.
    const currentValues = form.state.values;

    // 2. Use our new helper to get a flat list of all fields, including indexed repeatable fields.
    const fieldsToValidate = getRootFields(currentStepFields, currentValues);

    // console.log("fieldsToValidate",fieldsToValidate);
    
    // 3. Trigger validation for all these fields.
    await Promise.all(
      fieldsToValidate.map(field => form.validateField(field.name as any, 'submit'))
    );

    // 4. Check for errors.
    const hasErrors = fieldsToValidate.some(field => {
      const meta = form.getFieldMeta(field.name as any);
      return (meta?.errors?.length ?? 0) > 0;
    });

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