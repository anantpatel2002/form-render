"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionField } from '@/types/forms';
import FieldRenderer, { FieldRendererProps } from '../FieldRenderer';

interface SectionFieldProps extends Omit<FieldRendererProps, 'field'> {
    field: SectionField;
}

const SectionFieldComponent: React.FC<SectionFieldProps> = (props) => {
    const { field, ...rendererProps } = props;
    const [isCollapsed, setIsCollapsed] = useState(field.defaultCollapsed ?? false);

    const toggleCollapse = () => {
        if (field.collapsible) {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div
                className={`flex justify-between items-center ${field.collapsible ? 'cursor-pointer' : ''}`}
                onClick={toggleCollapse}
            >
                <h3 className="text-lg font-semibold text-gray-800">{field.title}</h3>
                {field.collapsible && (
                    <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    />
                )}
            </div>
            {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}

            {!isCollapsed && (
                <div className={`mt-4 grid grid-cols-1 md:grid-cols-${field.columns || 2} gap-x-6 gap-y-4`}>
                    {field.fields.map((childField) => (
                        <FieldRenderer
                            key={childField.name}
                            {...rendererProps} // Pass all renderer props down
                            field={childField}
                            value={rendererProps.formData[childField.name]}
                            error={rendererProps.errors[childField.name]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SectionFieldComponent;