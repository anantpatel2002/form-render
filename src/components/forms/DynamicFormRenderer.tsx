"use client";
import React from 'react';
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
  const form = useForm({
    defaultValues: getDefaultValues(formConfig.fields),
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        await onSubmit(value);
      }
      console.log('Form Submitted with TanStack Form:', value);
    },
  });

  const { shouldShowField } = useConditionalLogic();
  const dynamicFlow = useDynamicFlow();

  return (
    <form.Subscribe
      // We must subscribe to form values so our component re-renders when data changes
      selector={(state) => [state.values]}
      children={([formValues]) => ( // formValues is the current data of the form
        <FormContainer
          formConfig={formConfig}
          isSubmitting={form.state.isSubmitting}
          onSubmit={form.handleSubmit}
        >
          {formConfig.fields.map((fieldConfig) => (
            <FormFieldAdapter
              key={fieldConfig.name}
              form={form}
              fieldConfig={fieldConfig}
              dynamicFlow={dynamicFlow}
              // Pass the function and the current form data down
              shouldShowField={shouldShowField}
              formData={formValues}
            />
          ))}
        </FormContainer>
      )}
    />
  );
};

export default DynamicFormRenderer;