"use client"
import React from 'react';
import BaseField from './BaseField';
import { BaseField as BaseFieldType, FieldOption } from '@/types/forms';

// Common props interface
interface FieldProps {
    field: BaseFieldType;
    value: any;
    error?: string;
    onInputChange: (name: string, value: any) => void;
    disabled?: boolean;
}

// Radio Button Group
export const RadioGroupField: React.FC<FieldProps> = ({ field, value, error, onInputChange, disabled }) => {
    return (
        <BaseField field={field} error={error}>
            <div className="space-y-2">
                {field.options?.map((option: FieldOption) => (
                    <label key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onInputChange(field.name, e.target.value)}
                            disabled={disabled}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
        </BaseField>
    );
};

// Single Checkbox Field
export const CheckboxField: React.FC<FieldProps> = ({ field, value, error, onInputChange, disabled }) => {
    return (
        // BaseField is used differently here, wrapping the whole control
        <BaseField field={{ ...field, label: '' }} error={error}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={!!value}
                    onChange={(e) => onInputChange(field.name, e.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                    {field.label}
                </label>
            </div>
        </BaseField>
    );
};

// Switch (Toggle) Field
export const SwitchField: React.FC<FieldProps> = ({ field, value, error, onInputChange, disabled }) => {
    return (
        <BaseField field={{ ...field, label: '' }} error={error}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{field.label}</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={!!value}
                    onClick={() => onInputChange(field.name, !value)}
                    disabled={disabled}
                    className={`${value ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                >
                    <span className={`${value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
            </div>
        </BaseField>
    );
};