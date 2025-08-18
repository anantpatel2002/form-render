"use client";
import React from 'react';
import BaseField from './BaseField';
import { Upload, X, File as FileIcon } from 'lucide-react';

// Using the SimplifiedFieldApi interface from another file
// You can also define it here if you prefer
interface SimplifiedFieldApi {
    name: string;
    state: { value: any };
    handleChange: (value: any) => void;
}

interface FileFieldProps {
    field: SimplifiedFieldApi;
    label: string;
    error?: string;
    placeholder?: string;
}

export const FileField: React.FC<FileFieldProps> = ({ field, label, error, placeholder }) => {
    const file = field.state.value as File | null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        field.handleChange(selectedFile);
    };

    const clearFile = () => {
        field.handleChange(null);
    };

    return (
        <BaseField field={{ name: field.name, label }} error={error}>
            <div className="w-full">
                {file ? (
                    <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50">
                        <div className="flex items-center gap-2 text-sm">
                            <FileIcon size={16} className="text-gray-500" />
                            <span className="font-medium text-gray-800">{file.name}</span>
                            <span className="text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <button
                            type="button"
                            onClick={clearFile}
                            className="p-1 text-gray-500 hover:text-red-600 rounded-full"
                            aria-label="Remove file"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <label className="w-full flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                        <div className="text-center">
                            <Upload size={24} className="mx-auto text-gray-400" />
                            <p className="mt-1 text-sm text-gray-600">{placeholder || 'Click to upload a file'}</p>
                            <input
                                id={field.name}
                                name={field.name}
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                            />
                        </div>
                    </label>
                )}
            </div>
        </BaseField>
    );
};