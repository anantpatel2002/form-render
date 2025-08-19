"use client";
import React from 'react';
import { Field as FieldConfig, RepeatableField as RepeatableFieldConfig, SectionField, DynamicFlowField } from '@/types/forms';
import { useDynamicFlow } from '@/hooks/forms/useDynamicFlow';

import { InputField, PasswordField, TextareaField, DateField, NumberField } from './fields/TextFields';
import { RadioGroupField, SwitchField, CheckboxGroupField, SingleCheckboxField } from './fields/ChoiceFields';
import { SelectField } from './fields/SelectFields';
import DynamicFlowFieldComponent from './fields/DynamicFlowField';
import { createValidator } from '@/utils/forms/validation-adapter';
import RepeatableFieldComponent from './fields/RepeatableField';
import { FileField } from './fields/FileField';

interface FormFieldAdapterProps {
    form: any;
    fieldConfig: FieldConfig;
    dynamicFlow: any;
    // Add the new props here
    shouldShowField: (fieldConfig: FieldConfig, localData: Record<string, any>, globalData: Record<string, any>) => boolean;
    localData: Record<string, any>;
    globalData: Record<string, any>;
}

const FormFieldAdapter: React.FC<FormFieldAdapterProps> = ({ form, fieldConfig, dynamicFlow, shouldShowField, localData, globalData }) => {

    if (!shouldShowField(fieldConfig, localData, globalData)) {
        return null;
    }

    if (fieldConfig.type === 'section') {
        const sectionConfig = fieldConfig as SectionField;
        return (
            <fieldset className="p-4 mb-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">{sectionConfig.title}</legend>
                {sectionConfig.description && <p className="text-sm text-gray-500 mt-1 mb-4 px-2">{sectionConfig.description}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {sectionConfig.fields.map(childField => (
                        <FormFieldAdapter
                            key={childField.name}
                            form={form}
                            fieldConfig={childField}
                            dynamicFlow={dynamicFlow}
                            // Pass down the props
                            shouldShowField={shouldShowField}
                            localData={localData}
                            globalData={globalData}
                        />
                    ))}
                </div>
            </fieldset>
        );
    }

    // Handle 'dynamic-flow' fields
    if (fieldConfig.type === 'dynamic-flow') {
        return (
            <form.Field
                name={fieldConfig.name as any}
                children={(field: any) => (
                    <DynamicFlowFieldComponent
                        field={field}
                        // FIX #1: Use a type assertion to fix the type mismatch
                        fieldConfig={fieldConfig as DynamicFlowField}
                        flowState={dynamicFlow.flowsState[fieldConfig.name]}
                        initializeFlow={dynamicFlow.initializeFlow}
                        handleStepChange={dynamicFlow.handleStepChange}
                        error={field.state.meta.errors?.[0]}
                    />
                )}
            />
        );
    }

    // Handle other complex types
    if (fieldConfig.type === 'repeatable') {
        return (
            <RepeatableFieldComponent
                form={form}
                fieldConfig={fieldConfig as RepeatableFieldConfig}
                dynamicFlow={dynamicFlow}
                shouldShowField={shouldShowField}
                localData={localData} // Pass the same local context down
                globalData={globalData}
            />
        );
    }

    // For all simple fields, render the <form.Field> wrapper
    return (
        <form.Field
            name={fieldConfig.name as any}
            validators={{ onChange: createValidator(fieldConfig.validation) }}
            children={(field: any) => {
                const commonProps = {
                    field,
                    label: fieldConfig.label || '',
                    error: field.state.meta.errors?.[0],
                    placeholder: fieldConfig.placeholder,
                };

                switch (fieldConfig.type) {
                    case 'text':
                    case 'email':
                    case 'tel':
                        return <InputField {...commonProps} />;
                    case 'date':
                        return <DateField {...commonProps} />;

                    case 'number':
                        return <NumberField {...commonProps} />;
                    case 'password':
                        return <PasswordField {...commonProps} />;
                    case 'textarea':
                        return <TextareaField {...commonProps} />;
                    case 'radio':
                        return <RadioGroupField {...commonProps} options={fieldConfig.options} />;
                    case 'checkbox':
                        // If options are provided, render a group. Otherwise, render a single checkbox.
                        if (fieldConfig.options && fieldConfig.options.length > 0) {
                            return <CheckboxGroupField {...commonProps} options={fieldConfig.options} />;
                        }
                        return <SingleCheckboxField {...commonProps} />;
                    case 'switch':
                        return <SwitchField {...commonProps} />;
                    case 'select':
                        return (
                            <SelectField
                                field={commonProps.field}
                                error={commonProps.error}
                                fieldConfig={fieldConfig}
                                // Pass the form data through
                                formData={globalData}
                            />
                        );
                    case 'multi-select':
                        return (
                            <SelectField
                                field={commonProps.field}
                                error={commonProps.error}
                                fieldConfig={fieldConfig}
                                isMulti={true}
                                // Pass the form data through
                                formData={globalData}
                            />
                        );
                    case 'file':
                        return <FileField {...commonProps} />;
                    default:
                        return <p className="text-red-500">Unsupported field type: {fieldConfig.type}</p>;
                }
            }}
        />
    );
};

export default FormFieldAdapter;