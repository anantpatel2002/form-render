import { getCountries, getStatesByCountry } from './location-functions';
// Import other functions from other files as you create them

/**
 * A map of all available dynamic data-fetching functions.
 * The keys in this object must match the 'function' string in the form configuration.
 */
export const functionsMap: { [key: string]: (...args: any[]) => Promise<any> } = {
    getCountries,
    getStatesByCountry,
};