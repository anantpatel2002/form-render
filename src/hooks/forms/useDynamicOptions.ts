import { useState, useEffect, useCallback } from 'react';
import { FieldOption, OptionsSource, Field, SectionField, RepeatableField, FormConfig, FormData } from '@/types/forms';
import { functionsMap } from '@/generated/functionsIndex';

interface UseDynamicOptionsReturn {
  dynamicOptionsMap: { [key: string]: FieldOption[] };
  loadingOptionsMap: { [key: string]: boolean };
  loadOptions: (optionsSource: OptionsSource, dependsOnValue?: any) => Promise<FieldOption[]>;
}

export const useDynamicOptions = (formConfig: FormConfig, formData: FormData): UseDynamicOptionsReturn => {
  const [dynamicOptionsMap, setDynamicOptionsMap] = useState<{ [key: string]: FieldOption[] }>({});
  const [loadingOptionsMap, setLoadingOptionsMap] = useState<{ [key: string]: boolean }>({});

  // Dynamic options loading function
  const loadOptions = useCallback(async (optionsSource: OptionsSource, dependsOnValue: any = null): Promise<FieldOption[]> => {
    const callableFunction = functionsMap[optionsSource.function];
    if (!callableFunction) {
      console.warn(`Function ${optionsSource.function} not found in functionsMap`);
      return [];
    }
    
    try {
      return await callableFunction(dependsOnValue);
    } catch (error) {
      console.error(`Error calling ${optionsSource.function}:`, error);
      return [];
    }
  }, []);

  // Load options for fields with optionsSource
  useEffect(() => {
    const loadFieldsOptions = (fields: Field[], parentName?: string) => {
      fields.forEach((field) => {
        if (field.type === "section") {
          loadFieldsOptions((field as SectionField).fields, parentName);
        } else if (field.type === "repeatable") {
          loadFieldsOptions((field as RepeatableField).fields as Field[], field.name);
        } else if (field.type === "select" && field.optionsSource) {
          const name = field.name;

          // Determine dependsOn value
          let dependsOnValue = undefined;
          if (field.optionsSource.dependsOn) {
            dependsOnValue = formData[field.optionsSource.dependsOn as string];
          }

          // Only reload if we have the dependency value or no dependency is required
          if (!field.optionsSource.dependsOn || dependsOnValue) {
            setLoadingOptionsMap((prev) => ({ ...prev, [name]: true }));
            
            loadOptions(field.optionsSource, dependsOnValue)
              .then((opts) => {
                setDynamicOptionsMap((prev) => ({ ...prev, [name]: opts }));
              })
              .catch((error) => {
                console.error(`Failed to load options for ${name}:`, error);
                setDynamicOptionsMap((prev) => ({ ...prev, [name]: [] }));
              })
              .finally(() => {
                setLoadingOptionsMap((prev) => ({ ...prev, [name]: false }));
              });
          }
        }
      });
    };

    if (formConfig && formConfig.fields) {
      loadFieldsOptions(formConfig.fields);
    }
  }, [formConfig, formData, loadOptions]);

  return {
    dynamicOptionsMap,
    loadingOptionsMap,
    loadOptions
  };
};