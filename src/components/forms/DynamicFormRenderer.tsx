"use client"
import React, { useEffect } from 'react';
import { DynamicFormRendererProps } from '@/types/forms';
import {
  useFormState,
  useFormValidation,
  useDynamicOptions,
  useFlowState,
  useStepNavigation,
  useConditionalFields
} from '@/hooks/forms';
import { handleFormSubmission } from '@/utils/forms/form-helpers';
import FormContainer from './FormContainer';
import FieldRenderer from './FieldRenderer';

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ 
  formConfig,
  onSubmit,
  onChange,
  onStepChange,
  initialData,
  disabled,
  loading
}) => {
  // Initialize flow state hook first
  const {
    flowStates,
    setFlowStates,
    initializeFlowField,
    loadStepOptions,
    handleFlowStepChange,
    validateStep
  } = useFlowState();

  // Form state management
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    showPasswords,
    setShowPasswords,
    openDropdowns,
    setOpenDropdowns,
    handleInputChange,
    toggleDropdown
  } = useFormState(formConfig, initializeFlowField);

  // Conditional field visibility
  const { shouldShowField } = useConditionalFields(formData);

  // Form validation
  const {
    errors,
    setErrors,
    validateField,
    handleFieldBlur,
    clearFieldError,
    validateCurrentStep
  } = useFormValidation(shouldShowField);

  // Dynamic options loading
  const {
    dynamicOptionsMap,
    loadingOptionsMap,
    loadOptions
  } = useDynamicOptions(formConfig, formData);

  // Step navigation (for wizard forms)
  const {
    currentStep,
    setCurrentStep,
    getCurrentStepFields,
    handleNext,
    handlePrevious,
    isFirstStep,
    isLastStep,
    totalSteps
  } = useStepNavigation(formConfig);

  // Close dropdowns when step changes
  useEffect(() => {
    setOpenDropdowns({});
  }, [currentStep, setOpenDropdowns]);

  // Enhanced input change handler that clears errors
  const handleInputChangeWithErrorClear = (
    fieldName: string, 
    value: any, 
    repeatableParent?: string, 
    index?: number
  ) => {
    handleInputChange(fieldName, value, repeatableParent, index);
    clearFieldError(fieldName, repeatableParent, index);
    onChange?.(formData);
  };

  // Enhanced field blur handler
  const handleFieldBlurWithValidation = (field: any, repeatableParent?: string, index?: number) => {
    handleFieldBlur(field, formData, repeatableParent, index);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep(getCurrentStepFields(), formData, flowStates)) {
      return;
    }

    const resetForm = () => {
      setFormData({});
      setCurrentStep(0);
      setErrors({});
      setFlowStates({});
    };

    if (onSubmit) {
      await onSubmit(formData);
    } else {
      await handleFormSubmission(formConfig, formData, setIsSubmitting, resetForm);
    }
  };

  // Handle next step with validation
  const handleNextStep = () => {
    handleNext(() => validateCurrentStep(getCurrentStepFields(), formData, flowStates));
    onStepChange?.(currentStep + 1);
  };

  // Handle previous step
  const handlePreviousStep = () => {
    handlePrevious();
    onStepChange?.(currentStep - 1);
  };

  if (!formConfig) {
    return <div className="p-8 text-center">No form configuration provided</div>;
  }

  const currentStepFields = getCurrentStepFields();
  const isWizard = (formConfig.type === 'wizard' && formConfig.steps && formConfig.steps.length > 0) ? true : false;

  return (
    <FormContainer
      formConfig={formConfig}
      currentStep={currentStep}
      isWizard={isWizard}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      totalSteps={totalSteps}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onNext={handleNextStep}
      onPrevious={handlePreviousStep}
    >
      {currentStepFields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={formData[field.name]}
          error={errors[field.name]}
          formData={formData}
          errors={errors}
          shouldShowField={shouldShowField}
          onInputChange={handleInputChangeWithErrorClear}
          onFieldBlur={handleFieldBlurWithValidation}
          showPasswords={showPasswords}
          setShowPasswords={setShowPasswords}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          dynamicOptionsMap={dynamicOptionsMap}
          loadingOptionsMap={loadingOptionsMap}
          flowStates={flowStates}
          onFlowStepChange={(fieldName, stepId, value, field) => 
            handleFlowStepChange(fieldName, stepId, value, field, setFormData, setErrors)
          }
          disabled={disabled}
        />
      ))}
    </FormContainer>
  );
};

export default DynamicFormRenderer;