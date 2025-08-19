"use client";
import React, { useState } from 'react'; // Added useState for PasswordField
import BaseField from './BaseField';
import { Eye, EyeOff } from 'lucide-react';

// Make sure this interface is at the top of your file
interface TextFieldProps {
    field: any;
    label: string;
    error?: string;
    placeholder?: string;
}

// For standard text-based inputs
export const InputField: React.FC<TextFieldProps> = ({ field, label, error, placeholder }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
            />
        </BaseField>
    );
};

// For date inputs
export const DateField: React.FC<TextFieldProps> = ({ field, label, error }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </BaseField>
    );
};

// For number inputs
export const NumberField: React.FC<TextFieldProps> = ({ field, label, error, placeholder }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value === '' ? null : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                step="any"
            />
        </BaseField>
    );
};

// For password inputs
export const PasswordField: React.FC<TextFieldProps> = ({ field, label, error, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <div className="relative">
                <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </BaseField>
    );
};

// For textarea inputs
export const TextareaField: React.FC<TextFieldProps> = ({ field, label, error, placeholder }) => {
    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <textarea
                id={field.name}
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                rows={4}
            />
        </BaseField>
    );
};