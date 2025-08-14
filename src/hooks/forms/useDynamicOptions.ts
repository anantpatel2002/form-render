import { useState, useEffect, useCallback } from 'react';
import { FieldOption, OptionsSource, Field, SectionField, RepeatableField, FormConfig, FormData } from '@/types/forms';
import { getFunctionByName } from '@/lib/dynamicFunctionLoader';

interface UseDynamicOptionsReturn {
  dynamicOptionsMap: { [key: string]: FieldOption[] };
  loadingOptionsMap: { [key: string]: boolean };
  loadOptions: (optionsSource: OptionsSource, dependsOnValue?: any) => Promise<FieldOption[]>;
}

export const useDynamicOptions = (formConfig: FormConfig, formData: FormData): UseDynamicOptionsReturn => {
  const [dynamicOptionsMap, setDynamicOptionsMap] = useState<{ [key: string]: FieldOption[] }>({});
  const [loadingOptionsMap, setLoadingOptionsMap] = useState<{ [key: string]: boolean }>({});

  // In useDynamicOptions.ts

  const loadOptions = useCallback(async (optionsSource: OptionsSource, dependsOnValue: any = null): Promise<FieldOption[]> => {
    try {
      // 1. Asynchronously get the function using the loader
      const callableFunction = await getFunctionByName(optionsSource.function);

      // 2. The rest of the logic remains the same
      if (!callableFunction) {
        console.warn(`Function ${optionsSource.function} could not be loaded.`);
        return [];
      }

      // Pass dependsOnValue and any other params from the config
      const params = optionsSource.dependsOn ? [dependsOnValue, ...(optionsSource.params || [])] : (optionsSource.params || []);
      return await callableFunction(...params);

    } catch (error) {
      console.error(`Error loading or calling ${optionsSource.function}:`, error);
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