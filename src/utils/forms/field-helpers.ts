import { Field, SectionField, RepeatableField } from '@/types/forms';

/**
 * Recursively finds a field by its name within a nested structure of fields.
 * @param fields - The array of fields to search through.
 * @param name - The name of the field to find.
 * @returns {Field | null} - The found field object or null if not found.
 */
export const findFieldByName = (fields: Field[], name: string): Field | null => {
    for (const field of fields) {
        if (field.name === name) {
            return field;
        }
        if (field.type === 'section') {
            const found = findFieldByName((field as SectionField).fields, name);
            if (found) return found;
        }
        if (field.type === 'repeatable') {
            const found = findFieldByName((field as RepeatableField).fields, name);
            if (found) return found;
        }
    }
    return null;
};