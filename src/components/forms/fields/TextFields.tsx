"use client"
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import BaseField from './BaseField';
import { BaseField as BaseFieldType } from '@/types/forms';
import { getPasswordStrength, PasswordStrength } from '@/utils/forms/form-helpers';

// Props that are common to all field components
interface FieldProps {
    field: BaseFieldType;
    value: any;
    error?: string;
    onInputChange: (name: string, value: any) => void;
    onFieldBlur: (field: BaseFieldType) => void;
    disabled?: boolean;
}

// Props specific to the Password field
interface PasswordFieldProps extends FieldProps {
    showPasswords: { [key: string]: boolean };
    setShowPasswords: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

// General Input Field for text, email, number, date, tel
export const InputField: React.FC<FieldProps> = ({ field, value, error, onInputChange, onFieldBlur, disabled }) => {
    return (
        <BaseField field={field} error={error}>
            <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={value || ''}
                onChange={(e) => onInputChange(field.name, e.target.value)}
                onBlur={() => onFieldBlur(field)}
                placeholder={field.placeholder}
                disabled={disabled}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
        </BaseField>
    );
};

// Password Field with visibility toggle and strength meter
export const PasswordField: React.FC<PasswordFieldProps> = ({ field, value, error, onInputChange, onFieldBlur, showPasswords, setShowPasswords, disabled }) => {
    const isVisible = showPasswords[field.name];
    const passwordValue = value || '';

    // Assuming a minLength validation rule exists for password strength calculation
    const minLength = field.validation?.minLength?.value || 8;
    const strength: PasswordStrength = getPasswordStrength(passwordValue, minLength);

    const toggleVisibility = () => {
        setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }));
    };

    return (
        <BaseField field={field} error={error}>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    id={field.name}
                    name={field.name}
                    value={passwordValue}
                    onChange={(e) => onInputChange(field.name, e.target.value)}
                    onBlur={() => onFieldBlur(field)}
                    placeholder={field.placeholder}
                    disabled={disabled}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 disabled:bg-gray-100"
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {field.showPasswordStrength && passwordValue && (
                <div className="mt-2">
                    <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">{strength.label}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full ${strength.color}`}
                            style={{ width: `${strength.strength * 20}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </BaseField>
    );
};

// Textarea Field with optional character counter
export const TextareaField: React.FC<FieldProps> = ({ field, value, error, onInputChange, onFieldBlur, disabled }) => {
    const characterCount = value ? String(value).length : 0;
    const maxLength = field.validation?.maxLength?.value;

    return (
        <BaseField field={field} error={error}>
            <textarea
                id={field.name}
                name={field.name}
                value={value || ''}
                onChange={(e) => onInputChange(field.name, e.target.value)}
                onBlur={() => onFieldBlur(field)}
                placeholder={field.placeholder}
                rows={4}
                disabled={disabled}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
            {field.characterCounter && (
                <p className={`text-xs mt-1 text-right ${maxLength && characterCount > maxLength ? 'text-red-600' : 'text-gray-500'}`}>
                    {characterCount}{maxLength && ` / ${maxLength}`}
                </p>
            )}
        </BaseField>
    );
};