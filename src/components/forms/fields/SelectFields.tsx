"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Loader2 } from 'lucide-react';
import BaseField from './BaseField';
import { BaseField as BaseFieldType, FieldOption } from '@/types/forms';
import { getFunctionByName } from '@/lib/dynamicFunctionLoader';

interface SimplifiedFieldApi {
    name: string;
    state: { value: any };
    handleChange: (value: any) => void;
}
interface SelectFieldProps {
    field: SimplifiedFieldApi;
    error?: string;
    isMulti?: boolean;
    fieldConfig: BaseFieldType
    // We need the full form data to get the dependency's value
    formData: Record<string, any>;
}

export const SelectField: React.FC<SelectFieldProps> = ({ field, error, isMulti = false, fieldConfig, formData }) => {
    const [dynamicOptions, setDynamicOptions] = useState<FieldOption[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { label, placeholder, options: staticOptions, optionsSource } = fieldConfig;
    const dependencyField = optionsSource?.dependsOn as string;
    const dependencyValue = dependencyField ? formData[dependencyField] : null;

    useEffect(() => {
        // Don't fetch if there's no source
        if (!optionsSource) return;

        // If it depends on a field, but that field has no value, do nothing.
        if (dependencyField && !dependencyValue) {
            setDynamicOptions([]); // Clear options if dependency is cleared
            return;
        }

        setIsLoading(true);
        const fetchOptions = async () => {
            try {
                const fetcher = await getFunctionByName(optionsSource.function);
                // Pass the dependency's value to the fetcher function
                const newOptions = await fetcher(dependencyValue);
                setDynamicOptions(newOptions);
            } catch (e) {
                console.error(`Failed to fetch dynamic options for ${field.name}:`, e);
                setDynamicOptions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOptions();
    }, [optionsSource, dependencyField, dependencyValue, field.name]); // Re-run when the dependency's value changes

    useEffect(() => {
        if (field.state.value !== undefined) {
            field.handleChange(undefined);
        }
        // We only want this to run when the dependencyValue changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependencyValue]);

    const renderDisplayValue = () => {
        const currentOptions = dynamicOptions !== null ? dynamicOptions : (staticOptions || []);

        if (isMulti) {
            const selectedOptions = currentOptions.filter(opt =>
                Array.isArray(field.state.value) && field.state.value.includes(opt.value)
            );
            if (selectedOptions.length === 0) return <span className="text-gray-500">{placeholder || 'Select...'}</span>;
            return selectedOptions.map(opt => (
                <span key={opt.value} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {opt.label}
                    <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect(opt.value); }} />
                </span>
            ));
        }

        const selectedOption = currentOptions.find(opt => opt.value === field.state.value);
        return selectedOption ? selectedOption.label : <span className="text-gray-500">{placeholder || 'Select...'}</span>;
    };

    const handleSelect = (optionValue: string) => {
        if (isMulti) {
            const currentValue = Array.isArray(field.state.value) ? field.state.value : [];
            const newValue = currentValue.includes(optionValue)
                ? currentValue.filter((v: string) => v !== optionValue)
                : [...currentValue, optionValue];
            field.handleChange(newValue);
        } else {
            field.handleChange(optionValue);
            setIsOpen(false);
        }
    };

    const optionsToRender = dynamicOptions !== null ? dynamicOptions : (staticOptions || []);

    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none disabled:bg-gray-100"
                >
                    <span className="flex items-center flex-wrap gap-1 min-h-[20px]">{renderDisplayValue()}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {isLoading ? <Loader2 size={20} className="text-gray-400 animate-spin" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </span>
                </button>

                {isOpen && !isLoading && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                        {optionsToRender.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </BaseField>
    );
};