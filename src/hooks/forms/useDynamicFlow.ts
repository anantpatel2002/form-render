"use client";
import { useState, useCallback } from 'react';
import { FieldOption, DynamicFlowField } from '@/types/forms';
import { getFunctionByName } from '@/lib/dynamicFunctionLoader'; // Your dynamic loader

// Define the shape of our state
interface FlowStepState {
    value: string;
    options: FieldOption[];
    loading: boolean;
}
interface AllFlowsState {
    [fieldName: string]: { [stepId: string]: FlowStepState };
}

export const useDynamicFlow = () => {
    const [flowsState, setFlowsState] = useState<AllFlowsState>({});

    // Function to set up the initial state for a flow field
    const initializeFlow = useCallback(async (fieldConfig: DynamicFlowField) => {
        const fieldName = fieldConfig.name;
        const firstStep = fieldConfig.flow[0];

        // Pre-load the options for the very first step
        const options = await (await getFunctionByName(firstStep.optionsSource.function))();

        setFlowsState(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [firstStep.id]: { value: '', options, loading: false }
            }
        }));
    }, []);

    // Main handler for when a step's value changes
    const handleStepChange = useCallback(async (
        tanstackField: any, // The field object from TanStack Form
        fieldConfig: DynamicFlowField,
        stepId: string,
        newValue: string
    ) => {
        const fieldName = fieldConfig.name;
        const currentStepIndex = fieldConfig.flow.findIndex(s => s.id === stepId);
        if (currentStepIndex === -1) return;

        // 1. Update the value for the step that just changed
        setFlowsState(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [stepId]: { ...prev[fieldName]?.[stepId], value: newValue },
            },
        }));

        // 2. Reset all subsequent steps
        for (let i = currentStepIndex + 1; i < fieldConfig.flow.length; i++) {
            const stepToReset = fieldConfig.flow[i];
            setFlowsState(prev => ({
                ...prev,
                [fieldName]: {
                    ...prev[fieldName],
                    [stepToReset.id]: { value: '', options: [], loading: false },
                },
            }));
        }

        // 3. If this was the last step, update the main form value
        if (currentStepIndex === fieldConfig.flow.length - 1) {
            tanstackField.handleChange(newValue);
        } else {
            // Otherwise, clear the main form value
            tanstackField.handleChange(undefined);

            // 4. Load options for the NEXT step
            if (newValue) {
                const nextStep = fieldConfig.flow[currentStepIndex + 1];
                setFlowsState(prev => ({
                    ...prev,
                    [fieldName]: {
                        ...prev[fieldName],
                        [nextStep.id]: { ...prev[fieldName]?.[nextStep.id], loading: true },
                    },
                }));

                const optionsFetcher = await getFunctionByName(nextStep.optionsSource.function);
                const newOptions = await optionsFetcher(newValue);

                setFlowsState(prev => ({
                    ...prev,
                    [fieldName]: {
                        ...prev[fieldName],
                        [nextStep.id]: { value: '', options: newOptions, loading: false },
                    },
                }));
            }
        }
    }, []);

    return { flowsState, initializeFlow, handleStepChange };
};