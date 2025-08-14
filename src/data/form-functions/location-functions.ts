import { FieldOption } from '@/types/forms';

const countries: FieldOption[] = [
    { value: 'USA', label: 'United States' },
    { value: 'CAN', label: 'Canada' },
    { value: 'IND', label: 'India' },
];

const states: { [country: string]: FieldOption[] } = {
    USA: [
        { value: 'NY', label: 'New York' },
        { value: 'CA', label: 'California' },
        { value: 'TX', label: 'Texas' },
    ],
    CAN: [
        { value: 'ON', label: 'Ontario' },
        { value: 'QC', label: 'Quebec' },
        { value: 'BC', label: 'British Columbia' },
    ],
    IND: [
        { value: 'MH', label: 'Maharashtra' },
        { value: 'KA', label: 'Karnataka' },
        { value: 'DL', label: 'Delhi' },
    ]
};

/**
 * Mock function to get a list of countries.
 */
export const getCountries = async (): Promise<FieldOption[]> => {
    console.log('Fetching countries...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return countries;
};

/**
 * Mock function to get a list of states based on the selected country.
 * @param countryCode - The code of the selected country (e.g., 'USA').
 */
export const getStatesByCountry = async (countryCode: string): Promise<FieldOption[]> => {
    console.log(`Fetching states for country: ${countryCode}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return states[countryCode] || [];
};