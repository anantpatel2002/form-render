"use client"
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { RepeatableField } from '@/types/forms';
import FieldRenderer, { FieldRendererProps } from '../FieldRenderer';

interface RepeatableFieldProps extends Omit<FieldRendererProps, 'field' | 'value'> {
    field: RepeatableField;
    value: any[];
}

const RepeatableFieldComponent: React.FC<RepeatableFieldProps> = (props) => {
    const { field, value, onInputChange, ...rendererProps } = props;
    const items = Array.isArray(value) ? value : [];

    const handleAddItem = () => {
        const newItem = field.fields.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue ?? '' }), {});
        onInputChange(field.name, [...items, newItem]);
    };

    const handleRemoveItem = (indexToRemove: number) => {
        onInputChange(field.name, items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">{field.label}</h3>
            {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}

            <div className="space-y-6 mt-4">
                {items.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-300 rounded-md bg-white relative">
                        <h4 className="font-medium text-gray-700 mb-4">{`${field.sectionTitle} #${index + 1}`}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {field.fields.map((childField) => (
                                <FieldRenderer
                                    key={childField.name}
                                    {...rendererProps}
                                    field={childField}
                                    value={item[childField.name]}
                                    // Pass down props with parent context
                                    onInputChange={(name, val) => onInputChange(name, val, field.name, index)}
                                    onFieldBlur={(f) => rendererProps.onFieldBlur(f, field.name, index)}
                                    shouldShowField={(f) => rendererProps.shouldShowField(f, field.name, index)}
                                    error={rendererProps.errors[`${field.name}.${index}.${childField.name}`]}
                                    repeatableParent={field.name}
                                    repeatableIndex={index}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                            aria-label={`Remove ${field.sectionTitle} #${index + 1}`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {(field.maxItems === undefined || items.length < field.maxItems) && (
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Plus size={16} className="mr-2" />
                    {field.addButtonLabel || `Add ${field.sectionTitle}`}
                </button>
            )}
        </div>
    );
};

export default RepeatableFieldComponent;