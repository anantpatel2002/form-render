"use client";
import React from 'react';
import BaseField from './BaseField';
import { FieldOption } from '@/types/forms';

// A simplified interface for the props these components will receive
interface SimplifiedFieldApi {
    name: string;
    state: { value: any };
    handleChange: (value: any) => void;
}

interface ChoiceFieldProps {
    field: SimplifiedFieldApi;
    label: string;
    error?: string;
    options?: FieldOption[];
}

// Radio Button Group
export const RadioGroupField: React.FC<ChoiceFieldProps> = ({ field, label, error, options = [] }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={field.state.value === option.value}
                            onChange={() => field.handleChange(option.value)}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
        </BaseField>
    );
};


export const CheckboxGroupField: React.FC<ChoiceFieldProps> = ({ field, label, error, options = [] }) => {
    const handleChange = (optionValue: string) => {
        // Ensure we are always working with an array
        const currentValue = Array.isArray(field.state.value) ? field.state.value : [];
        const newValue = currentValue.includes(optionValue)
            ? currentValue.filter((v: string) => v !== optionValue) // Remove item
            : [...currentValue, optionValue]; // Add item
        field.handleChange(newValue);
    };

    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name={`${field.name}-${option.value}`} // Unique name for each checkbox
                            value={option.value}
                            checked={(Array.isArray(field.state.value) && field.state.value.includes(option.value)) || false}
                            onChange={() => handleChange(option.value)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
        </BaseField>
    );
};

// --- RENAMED for clarity ---
// Renders a single checkbox, often used as a boolean toggle
export const SingleCheckboxField: React.FC<ChoiceFieldProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name }} error={error}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    {label}
                </label>
            </div>
        </BaseField>
    );
};

// Switch (Toggle) Field
export const SwitchField: React.FC<ChoiceFieldProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name, label: '' }} error={error}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{label}</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={!!field.state.value}
                    onClick={() => field.handleChange(!field.state.value)}
                    className={`${field.state.value ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    <span className={`${field.state.value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
            </div>
        </BaseField>
    );
};