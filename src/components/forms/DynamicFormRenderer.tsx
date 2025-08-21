"use client";
import React from 'react';
import { useForm } from '@tanstack/react-form';
import { DynamicFormRendererProps } from '@/types/forms';
import FormContainer from './FormContainer';
import FormFieldAdapter from './FormFieldAdapter';
import { useDynamicFlow } from '@/hooks/forms/useDynamicFlow';
import { useConditionalLogic } from '@/hooks/forms/useConditionalLogic';
import { useStepNavigation } from '@/hooks/forms';
import { getDefaultValues } from '@/utils/forms/form-helpers';

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ formConfig, onSubmit }) => {

  const form = useForm({
    defaultValues: getDefaultValues(formConfig.fields),
    onSubmit: async ({ value }) => {
      if (onSubmit) await onSubmit(value);
      console.log("submitted");

    }
  });

  const { shouldShowField } = useConditionalLogic();
  const dynamicFlow = useDynamicFlow();
  // Pass the form instance to the navigation hook
  const stepNavigation = useStepNavigation(form, formConfig);

  const handleSubmitWrapper = (e: React.FormEvent<Element>, values: boolean | Record<string, any>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop the event from bubbling up
    console.log("form values", values);

    form.handleSubmit(); // Now, call the library's handler
  };

  return (
    <form.Subscribe
      selector={(state) => [state.values, state.isValid]}
      children={([values, isValid]) => (
        <FormContainer
          formConfig={formConfig}
          isSubmitting={form.state.isSubmitting}
          isValid={isValid as boolean}
          isWizard={formConfig.type === 'wizard'}
          isFirstStep={stepNavigation.isFirstStep} // Spread the navigation props
          isLastStep={stepNavigation.isLastStep}
          totalSteps={stepNavigation.totalSteps}
          currentStep={stepNavigation.currentStep}
          onSubmit={(e) => handleSubmitWrapper(e, values)}
          onNext={stepNavigation.handleNext}
          onPrevious={stepNavigation.handlePrevious}
        >
          {stepNavigation.currentStepFields.map((fieldConfig) => (
            <FormFieldAdapter
              key={fieldConfig.name}
              form={form}
              fieldConfig={fieldConfig}
              dynamicFlow={dynamicFlow}
              shouldShowField={shouldShowField}
              localData={values as Record<string, any>}
              globalData={values as Record<string, any>}
            />
          ))}
        </FormContainer>
      )}
    />
  );
};

export default DynamicFormRenderer;