"use client";
import React, { useEffect } from 'react';
import { DynamicFlowField, FieldOption } from '@/types/forms';
import { Loader2 } from 'lucide-react';
import BaseField from './BaseField';

// The props our component will receive
interface DynamicFlowFieldProps {
    field: any; // The field object from TanStack Form
    fieldConfig: DynamicFlowField;
    flowState: { [stepId: string]: { value: string; options: FieldOption[]; loading: boolean; } };
    initializeFlow: (fieldConfig: DynamicFlowField) => void;
    handleStepChange: (field: any, fieldConfig: DynamicFlowField, stepId: string, newValue: string) => void;
    error?: string;
}

const DynamicFlowFieldComponent: React.FC<DynamicFlowFieldProps> = ({
    field, fieldConfig, flowState, initializeFlow, handleStepChange, error
}) => {
    // Initialize the flow's state when the component mounts
    useEffect(() => {
        if (!flowState) {
            initializeFlow(fieldConfig);
        }
    }, [fieldConfig, flowState, initializeFlow]);

    return (
        <BaseField field={{ name: fieldConfig.name, label: fieldConfig.label }} error={error}>
            <div className="space-y-4">
                {fieldConfig.flow.map((step, index) => {
                    const stepState = flowState?.[step.id];
                    if (!stepState) return null; // Don't render if state isn't initialized

                    const prevStep = index > 0 ? fieldConfig.flow[index - 1] : null;
                    const isPrevStepSelected = prevStep ? flowState?.[prevStep.id]?.value : true;

                    return (
                        <div key={step.id}>
                            <label htmlFor={`${fieldConfig.name}-${step.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                {step.label}
                            </label>
                            <div className="relative">
                                <select
                                    id={`${fieldConfig.name}-${step.id}`}
                                    value={stepState.value || ''}
                                    onChange={(e) => handleStepChange(field, fieldConfig, step.id, e.target.value)}
                                    disabled={stepState.loading || !isPrevStepSelected}
                                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                                >
                                    <option value="">{step.placeholder || 'Select...'}</option>
                                    {stepState.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {stepState.loading && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Loader2 size={16} className="text-gray-400 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </BaseField>
    );
};

export default DynamicFlowFieldComponent;