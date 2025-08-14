"use client"
import React, { useRef, useEffect } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';
import BaseField from './BaseField';
import { BaseField as BaseFieldType, FieldOption } from '@/types/forms';

interface SelectFieldProps {
    field: BaseFieldType;
    value: any;
    error?: string;
    onInputChange: (name: string, value: any) => void;
    disabled?: boolean;
    dynamicOptionsMap: { [key: string]: FieldOption[] };
    loadingOptionsMap: { [key: string]: boolean };
    openDropdowns: { [key: string]: boolean };
    toggleDropdown: (fieldName: string, forceClose?: boolean) => void;
}

export const SelectField: React.FC<SelectFieldProps> = (props) => {
    const { field, value, error, onInputChange, disabled, dynamicOptionsMap, loadingOptionsMap, openDropdowns, toggleDropdown } = props;
    const isMulti = field.type === 'multi-select';
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = field.optionsSource ? dynamicOptionsMap[field.name] : field.options;
    const isLoading = field.optionsSource ? loadingOptionsMap[field.name] : false;
    const isOpen = openDropdowns[field.name] || false;

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                toggleDropdown(field.name, true); // force close
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [field.name, isOpen, toggleDropdown]);

    const handleSelect = (option: FieldOption) => {
        if (isMulti) {
            const currentValue = Array.isArray(value) ? value : [];
            const newValue = currentValue.includes(option.value)
                ? currentValue.filter((v: string) => v !== option.value)
                : [...currentValue, option.value];
            onInputChange(field.name, newValue);
        } else {
            onInputChange(field.name, option.value);
            toggleDropdown(field.name, true); // force close on single select
        }
    };

    const getDisplayValue = () => {
        if (isMulti) return null; // Multi-select displays pills instead
        if (!value) return <span className="text-gray-500">{field.placeholder}</span>;
        const selectedOption = options?.find(opt => opt.value === value);
        return selectedOption ? selectedOption.label : <span className="text-gray-500">{field.placeholder}</span>;
    };

    const selectedMultiOptions = isMulti && Array.isArray(value)
        ? options?.filter(opt => value.includes(opt.value)) || []
        : [];

    return (
        <BaseField field={field} error={error}>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => toggleDropdown(field.name)}
                    disabled={disabled || isLoading}
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                >
                    <span className="flex items-center flex-wrap gap-1">
                        {isMulti ? (
                            selectedMultiOptions.length > 0 ? (
                                selectedMultiOptions.map(opt => (
                                    <span key={opt.value} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {opt.label}
                                        <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect(opt); }} />
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500">{field.placeholder}</span>
                            )
                        ) : (
                            getDisplayValue()
                        )}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {isLoading ? <Loader2 size={16} className="text-gray-400 animate-spin" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </span>
                </button>

                {isOpen && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {options && options.length > 0 ? options.map((option) => {
                            const isSelected = isMulti ? Array.isArray(value) && value.includes(option.value) : value === option.value;
                            return (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 ${isSelected ? 'font-semibold' : 'font-normal'}`}
                                >
                                    <span className="block truncate">{option.label}</span>
                                    {isMulti && isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">✓</span>
                                    )}
                                </li>
                            );
                        }) : (
                            <li className="text-gray-500 text-center py-2 px-3">No options available</li>
                        )}
                    </ul>
                )}
            </div>
        </BaseField>
    );
};