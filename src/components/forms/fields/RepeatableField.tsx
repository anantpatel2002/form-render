"use client";
import React from 'react';
import { DynamicFlowField, Field as FieldConfig, RepeatableField as RepeatableFieldConfig } from '@/types/forms';
import { Plus, Trash2 } from 'lucide-react';
import BaseField from './BaseField';

// Import all the UI components that can be used inside a repeatable section
import { InputField, PasswordField, TextareaField } from './TextFields';
import { RadioGroupField, CheckboxField, SwitchField } from './ChoiceFields';
import { SelectField } from './SelectFields';
import { FileField } from './FileField';
import DynamicFlowFieldComponent from './DynamicFlowField';

interface RepeatableFieldProps {
    form: any;
    fieldConfig: RepeatableFieldConfig;
    dynamicFlow: any;
    error?: string;
    shouldShowField: (fieldConfig: FieldConfig, formData: Record<string, any>) => boolean;
    formData: Record<string, any>;
}

const RepeatableFieldComponent: React.FC<RepeatableFieldProps> = ({
    form,
    fieldConfig,
    dynamicFlow,
    error,
    shouldShowField,
    formData
}) => {
    const createDefaultItem = () => {
        const defaultItem: Record<string, any> = {};
        fieldConfig.fields.forEach(field => {
            // Use the field's defaultValue if available, otherwise fallback to an empty string
            defaultItem[field.name] = 'defaultValue' in field ? field.defaultValue : '';
        });
        return defaultItem;
    };

    return (
        <form.Field
            name={fieldConfig.name as any}
            validator={(value: any[]) => {
                const min = fieldConfig.validation?.min?.value;
                if (min && (!value || value.length < min)) {
                    return fieldConfig.validation?.min?.message;
                }
                const max = fieldConfig.validation?.max?.value;
                if (max && value && value.length > max) {
                    return fieldConfig.validation?.max?.message;
                }
            }}
            children={(field: any) => {
                const items = field.state.value || [];
                const minItems = fieldConfig.validation?.min?.value ?? 0;
                const maxItems = fieldConfig.validation?.max?.value ?? Infinity;

                return (
                    <BaseField field={{ name: fieldConfig.name, label: fieldConfig.label }} error={error || field.state.meta.errors[0]}>
                        <div className="space-y-4 mt-2">
                            {(items).map((item: any, index: number) => (
                                <div key={index} className="p-4 border border-gray-300 rounded-md bg-gray-50 relative">
                                    <button
                                        type="button"
                                        onClick={() => field.removeValue(index)}
                                        disabled={items.length <= minItems}
                                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={`Remove ${fieldConfig.sectionTitle}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <h4 className="font-medium text-gray-700 mb-4">{`${fieldConfig.sectionTitle} #${index + 1}`}</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                        {fieldConfig.fields.map(subFieldConfig => {
                                            if (!shouldShowField(subFieldConfig, formData)) {
                                                return null;
                                            }

                                            return (
                                                <form.Field
                                                    key={subFieldConfig.name}
                                                    name={`${fieldConfig.name}[${index}].${subFieldConfig.name}`}
                                                    children={(subField: any) => {
                                                        const commonProps = {
                                                            field: subField,
                                                            label: subFieldConfig.label || '',
                                                            error: subField.state.meta.errors?.[0],
                                                            placeholder: 'placeholder' in subFieldConfig ? subFieldConfig.placeholder : undefined,
                                                        };

                                                        switch (subFieldConfig.type) {
                                                            case 'text':
                                                            case 'email':
                                                            case 'number':
                                                            case 'date':
                                                            case 'tel':
                                                                return <InputField {...commonProps} />;
                                                            case 'password':
                                                                return <PasswordField {...commonProps} />;
                                                            case 'textarea':
                                                                return <TextareaField {...commonProps} />;
                                                            case 'radio':
                                                                return <RadioGroupField {...commonProps} options={subFieldConfig.options} />;
                                                            case 'checkbox':
                                                                return <CheckboxField {...commonProps} />;
                                                            case 'switch':
                                                                return <SwitchField {...commonProps} />;
                                                            case 'select':
                                                                return <SelectField {...commonProps} fieldConfig={subFieldConfig} formData={formData} />;
                                                            case 'multi-select':
                                                                return <SelectField {...commonProps} fieldConfig={subFieldConfig} formData={formData} isMulti={true} />;
                                                            case 'file':
                                                                return <FileField {...commonProps} />;
                                                            case 'dynamic-flow':
                                                                return (
                                                                    <DynamicFlowFieldComponent
                                                                        field={subField}
                                                                        fieldConfig={subFieldConfig as DynamicFlowField}
                                                                        flowState={dynamicFlow.flowsState[`${fieldConfig.name}[${index}].${subFieldConfig.name}`]}
                                                                        initializeFlow={dynamicFlow.initializeFlow}
                                                                        handleStepChange={dynamicFlow.handleStepChange}
                                                                        error={subField.state.meta.errors?.[0]}
                                                                    />
                                                                );
                                                            default:
                                                                return <p className="text-sm text-red-500">Unsupported sub-field type: {subFieldConfig.type}</p>;
                                                        }
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            {items.length < maxItems && (
                                <button
                                    type="button"
                                    onClick={() => field.pushValue(createDefaultItem())}
                                    className="mt-2 inline-flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    <Plus size={16} className="mr-2" />
                                    {fieldConfig.addButtonLabel || `Add ${fieldConfig.sectionTitle}`}
                                </button>
                            )}
                        </div>
                    </BaseField>
                );
            }}
        />
    );
};

export default RepeatableFieldComponent;