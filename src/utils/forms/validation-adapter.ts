import { Field as FieldConfig, SectionField, ValidationRules } from '@/types/forms/field-types';
import * as customValidators from '@/lib/formFunctions/customValidators';
import * as crossValidators from '@/lib/formFunctions/crossFieldValidators';

const customValidatorMap: Record<string, (value: any, allData: Record<string, any>) => string | null> = {
  validatePasswordStrength: customValidators.validatePasswordStrength,
  validatePasswordMatch: customValidators.validatePasswordMatch,
  validateFullName: customValidators.validateFullName,
};

export const createValidator = (rules?: ValidationRules) => {
  return ({ value, fieldApi }: { value: any; fieldApi: any }) => {
    if (!rules) {
      return;
    }

    const formData = fieldApi.form.state.values;
    console.log("formData for validation", formData);


    if (rules.required?.value && !value) {
      return rules.required.message;
    }

    if (!value) return;

    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }
      if (rules.maxLength && value.length > rules.maxLength.value) {
        return rules.maxLength.message;
      }
    }

    if (typeof value === 'number') {
      if (rules.min && value < rules.min.value) {
        return rules.min.message;
      }
      if (rules.max && value > rules.max.value) {
        return rules.max.message;
      }
    }

    if (rules.pattern && typeof value === 'string' && !new RegExp(rules.pattern.value).test(value)) {
      return rules.pattern.message;
    }

    if (rules.custom) {
      const validatorFn = customValidatorMap[rules.custom.function];
      if (validatorFn) {
        const errorMessage = validatorFn(value, formData);
        if (errorMessage) {
          return errorMessage;
        }
      } else {
        console.warn(`Custom validator function "${rules.custom.function}" not found.`);
      }
    }

    return;
  };
};

const crossValidatorMap: Record<string, Function> = {
  matchesDob: crossValidators.matchesDob,
  isAfter: crossValidators.isAfter,
  // Add any other cross-field validation functions here
};

export const createFormValidator = (fieldConfigs: FieldConfig[]) => {
  // First, flatten the field list to include fields inside sections
  const allFields = fieldConfigs.flatMap(field =>
    field.type === 'section' ? (field as SectionField).fields : [field]
  );



  return (values: Record<string, any>) => {
    const errors: Record<string, any> = {};

    // Loop through every field that has cross-validation rules defined in the JSON
    allFields.forEach(field => {
      if (field.crossValidation) {
        field.crossValidation.forEach(rule => {
          const validatorFn = crossValidatorMap[rule.rule];
          if (validatorFn) {
            // Check if the validation function passes
            const isValid = validatorFn(values, field.name, rule.dependsOn[0]);
            if (!isValid) {
              // If it fails, add the error message to the field that has the rule
              if (!errors[field.name]) {
                errors[field.name] = rule.message;
              }
            }
          }
        });
      }
    });


    return Object.keys(errors).length === 0 ? undefined : errors;
  };
};