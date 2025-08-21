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

/**
 * Recursively flattens an array of fields, extracting all non-structural fields
 * from sections and repeatable sections.
 * @param fields - The array of fields to process.
 * @returns {Field[]} - A flat array of all root fields.
 */
export const getRootFields = (fields: Field[]): Field[] => {
  const flattenedFields: Field[] = [];

  const recurse = (fieldList: Field[]) => {
    for (const field of fieldList) {
      if (field.type === 'section') {
        recurse((field as SectionField).fields);
      } else if (field.type === 'repeatable') {
        // We only care about the template fields for validation logic
        recurse((field as RepeatableField).fields);
      } else {
        flattenedFields.push(field);
      }
    }
  };

  recurse(fields);
  return flattenedFields;
};