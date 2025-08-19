"use client";
import React, { useMemo, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { DynamicFormRendererProps, Field as FieldConfig, SectionField, RepeatableField } from '@/types/forms';
import FormContainer from './FormContainer';
import FormFieldAdapter from './FormFieldAdapter';
import { useDynamicFlow } from '@/hooks/forms/useDynamicFlow';
import { useConditionalLogic } from '@/hooks/forms/useConditionalLogic';

// Helper to generate a default item for a repeatable field
const createDefaultRepeatableItem = (fields: FieldConfig[]) => {
  const defaultItem: Record<string, any> = {};
  fields.forEach(field => {
    defaultItem[field.name] = field.defaultValue ?? '';
  });
  return defaultItem;
};

// The getDefaultValues function now handles min validation for repeatable fields.
const getDefaultValues = (fields: FieldConfig[]): Record<string, any> => {
  const defaultValues: Record<string, any> = {};

  const processFields = (fieldList: FieldConfig[]) => {
    fieldList.forEach(field => {
      if (field.type === 'section') {
        processFields((field as SectionField).fields);
      } else if (field.type === 'repeatable') {
        const minItems = field.validation?.min?.value ?? 0;
        // If a minimum is set, create an array with that many default items.
        if (minItems > 0) {
          defaultValues[field.name] = Array.from(
            { length: minItems },
            () => createDefaultRepeatableItem((field as RepeatableField).fields)
          );
        } else {
          // Otherwise, use the provided defaultValue or an empty array.
          defaultValues[field.name] = field.defaultValue ?? [];
        }
      } else if ('defaultValue' in field) {
        defaultValues[field.name] = field.defaultValue;
      }
    });
  };

  processFields(fields);
  return defaultValues;
};
const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ formConfig, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: getDefaultValues(formConfig.fields),
    onSubmit: async ({ value }) => {
      if (onSubmit) await onSubmit(value);
      console.log('Wizard Form Submitted:', value);
    },
  });

  const { shouldShowField } = useConditionalLogic();
  const dynamicFlow = useDynamicFlow();

  const isWizard = formConfig.type === 'wizard' && !!formConfig.steps;

  // Memoize the visible fields for the current step to optimize rendering
  const currentStepFields = useMemo(() => {
    if (!isWizard) {
      return formConfig.fields; // Show all fields if not a wizard
    }
    const currentStepConfig = formConfig.steps![currentStep];
    if (!currentStepConfig) return [];

    // Filter the main fields array based on the names listed in the current step
    return formConfig.fields.filter(field =>
      currentStepConfig.fields.includes(field.name)
    );
  }, [isWizard, currentStep, formConfig.fields, formConfig.steps]);

  const totalSteps = isWizard ? formConfig.steps!.length : 1;

  // --- Navigation Handlers ---
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Immediately prevent the default form submission behavior.
    e.preventDefault();

    const fieldNamesToValidate = currentStepFields.map(f => f.name);

    for (const name of fieldNamesToValidate) {
      await form.validateField(name as any, 'blur');
    }

    const hasErrors = fieldNamesToValidate.some(name => {
      const meta = form.getFieldMeta(name as any);
      return (meta?.errors?.length ?? 0) > 0;
    });

    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <form.Subscribe
      selector={(state) => [state.values]}
      children={([formValues]) => (
        <FormContainer
          formConfig={formConfig}
          isSubmitting={form.state.isSubmitting}
          onSubmit={form.handleSubmit}
          // Pass all wizard-related state and handlers
          isWizard={isWizard}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === totalSteps - 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        >
          {/* Render only the fields for the current step */}
          {currentStepFields.map((fieldConfig) => (
            <FormFieldAdapter
              key={fieldConfig.name}
              form={form}
              fieldConfig={fieldConfig}
              dynamicFlow={dynamicFlow}
              shouldShowField={shouldShowField}
              localData={formValues}
              globalData={formValues}
            />
          ))}
        </FormContainer>
      )}
    />
  );
};

export default DynamicFormRenderer;