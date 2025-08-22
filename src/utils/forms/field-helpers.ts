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
 * Recursively flattens an array of fields, generating fully indexed names for fields
 * within repeatable sections based on the current form data.
 * @param fields - The array of field configurations to process.
 * @param formData - The current data object for the form.
 * @returns {Field[]} - A flat array of all root fields with correct names for validation.
 */
export const getRootFields = (fields: Field[], formData: Record<string, any>): Field[] => {
  const flattenedFields: Field[] = [];

  const recurse = (fieldList: Field[], parentName: string = '') => {
    for (const field of fieldList) {
      // Construct the full name for the current field
      const currentFieldName = parentName ? `${parentName}.${field.name}` : field.name;

      if (field.type === 'section') {
        recurse((field as SectionField).fields, parentName); // Sections don't nest names
      } else if (field.type === 'repeatable') {
        const repeatableData = formData[field.name] as any[];
        if (Array.isArray(repeatableData)) {
          // For each item in the repeatable array, recurse through its fields
          repeatableData.forEach((_, index) => {
            const indexedParentName = `${field.name}[${index}]`;
            recurse((field as RepeatableField).fields, indexedParentName);
          });
        }
      } else {
        // For standard fields, create a new field object with the full name
        flattenedFields.push({
          ...field,
          name: currentFieldName,
        });
      }
    }
  };

  recurse(fields);
  return flattenedFields;
};