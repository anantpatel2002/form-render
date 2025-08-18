"use client";
import React from 'react';
import BaseField from './BaseField';

// A simplified interface that describes only what our UI components need
interface SimplifiedFieldApi {
    name: string;
    state: {
        value: any;
    };
    handleBlur: () => void;
    handleChange: (value: any) => void;
}

// Use the simplified interface for the props
type FieldComponentProps = {
    field: SimplifiedFieldApi;
    label: string;
    error?: string;
};

export const InputField: React.FC<FieldComponentProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <input
                id={field.name}
                name={field.name}
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
        </BaseField>
    );
};

// You can reuse InputField for Password or create a more specific one
export const PasswordField: React.FC<FieldComponentProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <input
                type="password"
                id={field.name}
                name={field.name}
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
        </BaseField>
    );
};

export const TextareaField: React.FC<FieldComponentProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <textarea
                id={field.name}
                name={field.name}
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
        </BaseField>
    );
};