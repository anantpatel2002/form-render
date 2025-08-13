"use client"
import React from 'react';
import { Field, SectionField, RepeatableField, DynamicFlowField, FormData, FormErrors } from '@/types/forms';
import SectionFieldComponent from './fields/SectionField';
import RepeatableFieldComponent from './fields/RepeatableField';
import DynamicFlowFieldComponent from './fields/DynamicFlowField';
import BaseField from './fields/BaseField';

interface FieldRendererProps {
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
  flowStates: any;
  onFlowStepChange: (fieldName: string, stepId: string, value: string, field: DynamicFlowField) => void;
  disabled?: boolean;
  repeatableParent?: string;
  repeatableIndex?: number;
}

const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const { field } = props;

  // Don't render if field should not be shown
  if (!props.shouldShowField(field, props.repeatableParent, props.repeatableIndex)) {
    return null;
  }

  // Route to appropriate field component based on type
  switch (field.type) {
    case 'section':
      return (
        <SectionFieldComponent
          {...props}
          field={field as SectionField}
        />
      );

    case 'repeatable':
      return (
        <RepeatableFieldComponent
          {...props}
          field={field as RepeatableField}
        />
      );

    case 'dynamic-flow':
      return (
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <DynamicFlowFieldComponent
            {...props}
            field={field as DynamicFlowField}
          />
        </div>
      );

    default:
      return (
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <BaseField {...props} />
        </div>
      );
  }
};

export default FieldRenderer;