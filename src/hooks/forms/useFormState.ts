import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FormConfig, FormData, Field, SectionField, RepeatableField, DynamicFlowField } from '@/types/forms';

interface UseFormStateReturn {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  showPasswords: { [key: string]: boolean };
  setShowPasswords: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  openDropdowns: { [key: string]: boolean };
  setOpenDropdowns: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  handleInputChange: (fieldName: string, value: any, repeatableParent?: string, index?: number) => void;
  toggleDropdown: (fieldName: string, forceClose?: boolean) => void;
}

export const useFormState = (
  formConfig: FormConfig,
  initializeFlowField: (field: DynamicFlowField) => void
): UseFormStateReturn => {
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // Initialize form data with default values
  useEffect(() => {
    const initializeFormData = () => {
      const initialData: { [key: string]: any } = {};

      const processFields = (fields: Field[]) => {
        fields.forEach((field) => {
          if (field.type === 'dynamic-flow') {
            initializeFlowField(field as DynamicFlowField);
          } else if (field.type === 'section') {
            processFields((field as SectionField).fields);
          } else if (field.type === 'repeatable') {
            initialData[field.name] = [{}];
            processFields((field as RepeatableField).fields);
          } else {
            if (field.defaultValue !== undefined) {
              initialData[field.name] = field.defaultValue;
            } else if (field.type === 'checkbox' || field.type === 'multi-select') {
              initialData[field.name] = [];
            } else if (field.type === 'switch') {
              initialData[field.name] = false;
            }
          }
        });
      };

      processFields(formConfig.fields);
      setFormData(initialData);
    };

    if (formConfig) {
      initializeFormData();
    }
  }, [formConfig, initializeFlowField]);

  // Handle input changes
  const handleInputChange = (fieldName: string, value: any, repeatableParent?: string, index?: number) => {
    setFormData(prev => {
      const newData = { ...prev };

      if (repeatableParent && index !== undefined) {
        // Handle repeatable fields - store data in parent array
        if (!newData[repeatableParent]) newData[repeatableParent] = [];
        if (!newData[repeatableParent][index]) newData[repeatableParent][index] = {};
        newData[repeatableParent][index][fieldName] = value;
      } else {
        newData[fieldName] = value;
      }

      return newData;
    });
  };

  const toggleDropdown = (fieldName: string, forceClose = false) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [fieldName]: forceClose ? false : !prev[fieldName]
    }));
  };

  // Close all dropdowns when moving between form steps or major changes
  useEffect(() => {
    setOpenDropdowns({});
  }, []);

  return {
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
  };
};