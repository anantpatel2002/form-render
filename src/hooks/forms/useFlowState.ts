import { useState, useCallback } from 'react';
import { FieldOption, DynamicFlowField, FlowStep, FormData } from '@/types/forms';
import { functionsMap } from '@/generated/functionsIndex';

interface FlowStepState {
  value: string;
  options: FieldOption[];
  loading: boolean;
}

interface FlowStates {
  [fieldName: string]: {
    [stepId: string]: FlowStepState;
  };
}

interface UseFlowStateReturn {
  flowStates: FlowStates;
  setFlowStates: React.Dispatch<React.SetStateAction<FlowStates>>;
  initializeFlowField: (field: DynamicFlowField) => void;
  loadStepOptions: (fieldName: string, step: FlowStep, dependsOnValue?: string) => Promise<FieldOption[]>;
  handleFlowStepChange: (
    fieldName: string,
    stepId: string,
    value: string,
    field: DynamicFlowField,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    setErrors: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  validateStep: (fieldName: string, step: FlowStep, currentFlowStates: FlowStates) => string;
}

export const useFlowState = (): UseFlowStateReturn => {
  const [flowStates, setFlowStates] = useState<FlowStates>({});

  const loadStepOptions = useCallback(async (
    fieldName: string,
    step: FlowStep,
    dependsOnValue?: string
  ): Promise<FieldOption[]> => {
    const functionName = step.optionsSource.function as keyof typeof functionsMap;
    const loadFunction = functionsMap[functionName];

    if (!loadFunction) {
      console.warn(`Function ${functionName} not found`);
      return [];
    }

    // Update loading state
    setFlowStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [step.id]: {
          ...prev[fieldName]?.[step.id],
          loading: true
        }
      }
    }));

    try {
      // Simulate async call
      await new Promise(resolve => setTimeout(resolve, 300));

      const options = dependsOnValue
        ? (loadFunction as any)(dependsOnValue)
        : (loadFunction as any)();

      setFlowStates(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          [step.id]: {
            ...prev[fieldName]?.[step.id],
            options: options || [],
            loading: false
          }
        }
      }));

      return options || [];
    } catch (error) {
      console.error(`Error loading options for ${step.id}:`, error);
      setFlowStates(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          [step.id]: {
            ...prev[fieldName]?.[step.id],
            options: [],
            loading: false
          }
        }
      }));
      return [];
    }
  }, []);

  // Initialize flow field
  const initializeFlowField = useCallback((field: DynamicFlowField) => {
    const initialState: any = {};

    field.flow.forEach(step => {
      initialState[step.id] = {
        value: '',
        options: [],
        loading: false
      };
    });

    setFlowStates(prev => ({
      ...prev,
      [field.name]: initialState
    }));

    // Load options for the first step (which has no dependencies)
    const firstStep = field.flow[0];
    if (firstStep && !firstStep.optionsSource.dependsOn) {
      loadStepOptions(field.name, firstStep);
    }
  }, [loadStepOptions]);

  const validateStep = useCallback((
    fieldName: string,
    step: FlowStep,
    currentFlowStates: FlowStates
  ): string => {
    const stepState = currentFlowStates[fieldName]?.[step.id];
    if (!stepState) return '';

    if (step.validation?.required?.value && !stepState.value) {
      return step.validation.required.message || `${step.label} is required`;
    }
    return '';
  }, []);

  // Handle flow step change
  const handleFlowStepChange = useCallback((
    fieldName: string,
    stepId: string,
    value: string,
    field: DynamicFlowField,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    setErrors: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const stepIndex = field.flow.findIndex(step => step.id === stepId);
    const currentStepConfig = field.flow[stepIndex];

    if (!currentStepConfig) return;

    // Temporarily store the new flow state to pass to validateStep immediately
    let newFlowStatesForValidation = { ...flowStates };

    // Update the current step's value
    newFlowStatesForValidation = {
      ...newFlowStatesForValidation,
      [fieldName]: {
        ...newFlowStatesForValidation[fieldName],
        [stepId]: {
          ...newFlowStatesForValidation[fieldName]?.[stepId],
          value
        }
      }
    };

    // Reset all subsequent steps
    const subsequentSteps = field.flow.slice(stepIndex + 1);
    subsequentSteps.forEach(step => {
      if (newFlowStatesForValidation[fieldName]?.[step.id]) {
        newFlowStatesForValidation[fieldName][step.id] = {
          value: '',
          options: [],
          loading: false
        };
      }
    });

    // Set the full updated flowStates
    setFlowStates(newFlowStatesForValidation);

    // Load options for the next step if value is selected
    if (value && stepIndex < field.flow.length - 1) {
      const nextStep = field.flow[stepIndex + 1];
      if (nextStep.optionsSource.dependsOn === stepId) {
        loadStepOptions(fieldName, nextStep, value);
      }
    }

    // Update the main form data with the output value
    if (stepId === field.outputStepId) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));

      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }

    // Handle step validation
    const stepValidationMessage = validateStep(fieldName, currentStepConfig, newFlowStatesForValidation);
    setErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };
      const errorKey = `${fieldName}.${stepId}`;
      if (stepValidationMessage) {
        newErrors[errorKey] = stepValidationMessage;
      } else {
        delete newErrors[errorKey];
      }
      return newErrors;
    });

    // Clear errors for subsequent steps
    subsequentSteps.forEach(step => {
      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        const errorKey = `${fieldName}.${step.id}`;
        if (newErrors[errorKey]) {
          delete newErrors[errorKey];
        }
        return newErrors;
      });
    });
  }, [flowStates, loadStepOptions, validateStep]);

  return {
    flowStates,
    setFlowStates,
    initializeFlowField,
    loadStepOptions,
    handleFlowStepChange,
    validateStep
  };
};