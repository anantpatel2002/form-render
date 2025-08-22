"use client";
import React from 'react';
import { Field as FieldConfig, FormInstance, RepeatableField as RepeatableFieldConfig } from '@/types/forms';

import FormFieldAdapter from '../FormFieldAdapter';

interface RepeatableFieldProps {
    form: FormInstance;
    fieldConfig: RepeatableFieldConfig;
    dynamicFlow: any;
    error?: string;
    shouldShowField: (fieldConfig: FieldConfig, localData: Record<string, any>, globalData: Record<string, any>, itemData?: Record<string, any>) => boolean;
    localData: Record<string, any>;
    globalData: Record<string, any>;
}

const RepeatableFieldComponent: React.FC<RepeatableFieldProps> = ({
    form,
    fieldConfig,
    dynamicFlow,
    shouldShowField,
    localData,
    globalData
}) => {
    return (
        <form.Field
            name={fieldConfig.name as any}
            children={(field: any) => {
                // We get the array of items from the field's state
                const items = (field.state.value as any[]) || [];

                const addItem = () => {
                    // Create a default item based on the fields within the repeatable section
                    const defaultItem: Record<string, any> = {};
                    fieldConfig.fields.forEach(f => {
                        defaultItem[f.name] = f.defaultValue ?? null;
                    });
                    field.pushValue(defaultItem);

                };

                const removeItem = (index: number) => {
                    field.removeValue(index);
                };

                return (
                    <div className="p-4 rounded-md bg-gray-200">
                        <label className="block text-sm font-medium text-gray-800 mb-2">{fieldConfig.sectionTitle}</label>
                        {field.state.meta.errors?.[0] && <p className="text-sm text-red-600 mb-2">{field.state.meta.errors[0]}</p>}

                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="p-4 rounded relative bg-white shadow-sm">
                                    {items.length > (fieldConfig.validation?.min?.value ?? 0) && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 font-bold"
                                            aria-label="Remove item"
                                        >
                                            &times;
                                        </button>
                                    )}
                                    <div className={`grid grid-cols-1 md:grid-cols-${fieldConfig.columns || 1} gap-4`}>
                                        {fieldConfig.fields.map(childField => (
                                            <FormFieldAdapter
                                                key={childField.name}
                                                form={form}
                                                fieldConfig={{ ...childField, name: `${fieldConfig.name}[${index}].${childField.name}` }}
                                                dynamicFlow={dynamicFlow}
                                                shouldShowField={shouldShowField}
                                                localData={localData}
                                                globalData={globalData}
                                                itemData={item}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className={items.length >= (fieldConfig.maxItems || 3) ? 'hidden' : '"mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"'}
                        >
                            {fieldConfig.addButtonLabel || '+ Add Item'}
                        </button>
                    </div>
                );
            }}
        />
    );
};

export default RepeatableFieldComponent;