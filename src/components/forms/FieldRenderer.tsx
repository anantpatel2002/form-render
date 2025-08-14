"use client"
import React from 'react';
import {
  Field, SectionField, RepeatableField, DynamicFlowField,
  FormData, FormErrors, DynamicFormRendererProps,
  FieldOption
} from '@/types/forms';

// Import all field components
import SectionFieldComponent from './fields/SectionField';
import RepeatableFieldComponent from './fields/RepeatableField';
import DynamicFlowFieldComponent from './fields/DynamicFlowField';
import { InputField, PasswordField, TextareaField } from './fields/TextFields';
import { RadioGroupField, CheckboxField, SwitchField } from './fields/ChoiceFields';
import { SelectField } from './fields/SelectFields';

// Re-export the props interface for convenience in other components
export interface FieldRendererProps {
  field: Field;
  value: any;
  error?: string;
  formData: FormData;
  errors: FormErrors;
  shouldShowField: (field: Field, repeatableParent?: string, index?: number) => boolean;
  onInputChange: (fieldName: string, value: any, repeatableParent?: string, index?: number) => void;
  onFieldBlur: (field: Field, repeatableParent?: string, index?: number) => void;
  showPasswords: { [key: string]: boolean };
  setShowPasswords: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  openDropdowns: { [key: string]: boolean };
  toggleDropdown: (fieldName: string, forceClose?: boolean) => void;
  dynamicOptionsMap: { [key: string]: any[] };
  loadingOptionsMap: { [key: string]: boolean };
  flowStates: {
    [fieldName: string]: {
      [stepId: string]: {
        value: string;
        options: FieldOption[];
        loading: boolean;
      }
    }
  };
  onFlowStepChange: (fieldName: string, stepId: string, value: string, field: DynamicFlowField) => void;
  disabled?: boolean;
  repeatableParent?: string;
  repeatableIndex?: number;
}

const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const { field, shouldShowField, repeatableParent, repeatableIndex } = props;

  // Don't render if field should not be shown
  if (!shouldShowField(field, repeatableParent, repeatableIndex)) {
    return null;
  }

  // Route to appropriate field component based on type
  switch (field.type) {
    case 'section':
      return <SectionFieldComponent {...props} field={field as SectionField} />;

    case 'repeatable':
      return <RepeatableFieldComponent {...props} field={field as RepeatableField} value={props.formData[field.name]} />;

    case 'dynamic-flow':
      return <DynamicFlowFieldComponent {...props} field={field as DynamicFlowField} />;

    case 'text':
    case 'email':
    case 'number':
    case 'date':
    case 'tel':
      return <InputField {...props} />;

    case 'password':
      return <PasswordField {...props} />;

    case 'textarea':
      return <TextareaField {...props} />;

    case 'radio':
      return <RadioGroupField {...props} />;

    case 'checkbox':
      return <CheckboxField {...props} />;

    case 'switch':
      return <SwitchField {...props} />;

    case 'select':
    case 'multi-select':
      return <SelectField {...props} />;

    default:
      return (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-sm text-yellow-800">
            Unrecognized field type: <span className="font-bold">{field.type}</span>
          </p>
        </div>
      );
  }
};

export default FieldRenderer;