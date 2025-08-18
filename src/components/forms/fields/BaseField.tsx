"use client";
import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

// A new, more flexible interface for the props
interface BaseFieldProps {
    field: {
        name: string;
        label?: string;
        helpText?: string;
        tooltip?: string;
    };
    error?: string;
    children: React.ReactNode;
}

const BaseField: React.FC<BaseFieldProps> = ({ field, error, children }) => {
    const { name, label, helpText, tooltip } = field;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {tooltip && (
                        <span className="ml-2 group relative">
                            <Info size={14} className="text-gray-400 cursor-pointer" />
                            <span
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                role="tooltip"
                            >
                                {tooltip}
                            </span>
                        </span>
                    )}
                </label>
            )}

            {children}

            {error && (
                <div className="flex items-center mt-1 text-sm text-red-600" role="alert">
                    <AlertCircle size={14} className="mr-1" />
                    <span>{error}</span>
                </div>
            )}

            {helpText && !error && (
                <p className="mt-1 text-xs text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default BaseField;