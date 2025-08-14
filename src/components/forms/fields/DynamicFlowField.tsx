"use client"
import React from 'react';
import { Loader2 } from 'lucide-react';
import { DynamicFlowField as DynamicFlowFieldType } from '@/types/forms';
import { FieldRendererProps } from '../FieldRenderer';

interface DynamicFlowFieldProps extends Omit<FieldRendererProps, 'field'> {
    field: DynamicFlowFieldType;
}

const DynamicFlowFieldComponent: React.FC<DynamicFlowFieldProps> = (props) => {
    const { field, flowStates, onFlowStepChange, errors } = props;
    const currentFlowState = flowStates[field.name] || {};

    return (
        <div className="space-y-4">
            {field.flow.map((step, index) => {
                const stepState = currentFlowState[step.id];
                const prevStep = index > 0 ? field.flow[index - 1] : null;
                const prevStepValue = prevStep ? currentFlowState[prevStep.id]?.value : true; // First step is always visible
                const errorKey = `${field.name}.${step.id}`;

                if (!prevStepValue) return null; // Don't render step if its dependency isn't met

                return (
                    <div key={step.id}>
                        <label htmlFor={`${field.name}-${step.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            {step.label}
                        </label>
                        <div className="relative">
                            <select
                                id={`${field.name}-${step.id}`}
                                value={stepState?.value || ''}
                                onChange={(e) => onFlowStepChange(field.name, step.id, e.target.value, field)}
                                disabled={stepState?.loading || !stepState?.options?.length}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                            >
                                <option value="">{step.placeholder || 'Select an option'}</option>
                                {stepState?.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {stepState?.loading && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Loader2 size={16} className="text-gray-400 animate-spin" />
                                </div>
                            )}
                        </div>
                        {errors[errorKey] && <p className="mt-1 text-sm text-red-600">{errors[errorKey]}</p>}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicFlowFieldComponent;