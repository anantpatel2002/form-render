"use client";
import React from 'react';
import { Field as FieldConfig, SectionField, RepeatableField, DynamicFlowField } from '@/types/forms/field-types';
import { createValidator } from '@/utils/forms/validation-adapter';
import { InputField, PasswordField, TextareaField, DateField, NumberField } from './fields/TextFields';
import { RadioGroupField, SingleCheckboxField, CheckboxGroupField, SwitchField } from './fields/ChoiceFields';
import { SelectField } from './fields/SelectFields';
import { FileField } from './fields/FileField';
import RepeatableFieldComponent from './fields/RepeatableField';
import DynamicFlowFieldComponent from './fields/DynamicFlowField';
import { FormInstance } from '@/types/forms';

interface FormFieldAdapterProps {
    form: FormInstance;
    fieldConfig: FieldConfig;
    dynamicFlow: any;
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
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{sectionConfig.title}</h3>
                    {sectionConfig.description && <p className="text-sm text-gray-500 mt-1">{sectionConfig.description}</p>}
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-${sectionConfig.columns || 1} gap-x-6 gap-y-4`}>
                    {sectionConfig.fields.map(childField => (
                        <FormFieldAdapter
                            key={childField.name}
                            form={form}
                            fieldConfig={childField}
                            dynamicFlow={dynamicFlow}
                            shouldShowField={shouldShowField}
                            localData={localData}
                            globalData={globalData}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <form.Field
            name={fieldConfig.name}
            validators={{
                onChange: createValidator(fieldConfig.validation)
            }}
        >

            {(field: any) => {
                const commonProps = {
                    field,
                    label: fieldConfig.label || '',
                    error: field.state.meta.errors?.[0],
                    placeholder: 'placeholder' in fieldConfig ? fieldConfig.placeholder : undefined,
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
                        if (fieldConfig.options && fieldConfig.options.length > 0) {
                            return <CheckboxGroupField {...commonProps} options={fieldConfig.options} />;
                        }
                        return <SingleCheckboxField {...commonProps} />;
                    case 'switch':
                        return <SwitchField {...commonProps} />;
                    case 'select':
                        return <SelectField {...commonProps} fieldConfig={fieldConfig} formData={globalData} />;
                    case 'multi-select':
                        return <SelectField {...commonProps} fieldConfig={fieldConfig} isMulti={true} formData={globalData} />;
                    case 'file':
                        return <FileField {...commonProps} />;
                    case 'repeatable':
                        return <RepeatableFieldComponent form={form} fieldConfig={fieldConfig as RepeatableField} dynamicFlow={dynamicFlow} error={form.getFieldMeta(fieldConfig.name as any)?.errors[0]} shouldShowField={shouldShowField} localData={localData} globalData={globalData} />;
                    case 'dynamic-flow':
                        return <DynamicFlowFieldComponent field={field} fieldConfig={fieldConfig as DynamicFlowField} flowState={dynamicFlow.flowsState[field.name]} initializeFlow={dynamicFlow.initializeFlow} handleStepChange={dynamicFlow.handleStepChange} error={commonProps.error} />;
                    default:
                        return <p>Unsupported field type: {fieldConfig.type}</p>;
                }
            }}


        </form.Field>
    )


};

export default FormFieldAdapter;