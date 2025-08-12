"use client"
import React, { useState, useEffect, useCallback } from 'react';
import {
    User, Settings, Shield, ChevronRight, ChevronLeft,
    Eye, EyeOff, Upload, X, Plus, Trash2, Check,
    AlertCircle, Info, Phone, Mail, MapPin,
    Clock, Palette, Book, Heart, Star, CheckCircle,
    RefreshCw
} from 'lucide-react';
import { functionsMap } from '@/generated/functionsIndex';

// Base field validation types
interface ValidationRule {
    value: any;
    message: string;
}

interface CustomValidation {
    function: string;
    message: string;
    async?: boolean;
    debounce?: number;
}

interface FieldValidation {
    required?: ValidationRule;
    minLength?: ValidationRule;
    maxLength?: ValidationRule;
    min?: ValidationRule;
    max?: ValidationRule;
    pattern?: ValidationRule;
    custom?: CustomValidation;
    allowedTypes?: string[];
    maxSizeMB?: number;
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: string;
}

// Field option types
export interface FieldOption {
    value: string;
    label: string;
    description?: string;
    icon?: string;
}

// Show when conditions
interface ShowWhenCondition {
    field: string;
    operator: 'eq' | 'neq' | 'in' | 'notIn' | 'gt' | 'lt' | 'gte' | 'lte';
    value: any;
}

interface ShowWhen {
    conditions: ShowWhenCondition[];
    logic?: 'and' | 'or';
}

// Options source for dynamic loading
export interface OptionsSource {
    function: string;
    dependsOn?: string | string[];
    cache?: boolean;
    cacheTimeout?: number;
    params?:string[];
}

// Base field interface
interface BaseField {
    name: string;
    label?: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'textarea' |
    'select' | 'multi-select' | 'auto-complete' | 'radio' | 'checkbox' | 'switch' | 'color' | 'file' | 'section' | 'repeatable' | 'dynamic-flow';
    placeholder?: string;
    helpText?: string;
    tooltip?: string;
    defaultValue?: any;
    validation?: FieldValidation;
    showWhen?: ShowWhen;
    options?: FieldOption[];
    optionsSource?: OptionsSource;
    characterCounter?: boolean;
    showPasswordStrength?: boolean;
    presetColors?: string[];
    preview?: boolean;
    layout?: 'grid' | 'list';
    columns?: number;
}

// Section field type
interface SectionField extends Omit<BaseField, 'type'> {
    type: 'section';
    title: string;
    description?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    fields: Field[];
}

// Repeatable field type
interface RepeatableField extends Omit<BaseField, 'type'> {
    type: 'repeatable';
    sectionTitle: string;
    description?: string;
    addButtonLabel?: string;
    removeButtonLabel?: string;
    maxItems?: number;
    validation?: {
        min?: ValidationRule;
        max?: ValidationRule;
    };
    fields: Omit<Field, 'showWhen'>[];
}

// Add to your existing Field union type
interface FlowStep {
    id: string;
    label: string;
    placeholder?: string;
    helpText?: string;
    optionsSource: {
        function: string;
        dependsOn?: string;
        cache?: boolean;
        cacheTimeout?: number;
    };
    validation?: FieldValidation;
}

interface DynamicFlowField extends Omit<BaseField, 'type'> {
    type: 'dynamic-flow';
    flow: FlowStep[];
    outputStepId: string;
    showAllSteps?: boolean;
    flowLayout?: 'vertical' | 'horizontal' | 'grid';
    confirmReset?: boolean;
}

// Update your Field union type to include DynamicFlowField
export type Field = BaseField | SectionField | RepeatableField | DynamicFlowField;

// Form step configuration
interface FormStep {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    fields: string[];
}

// Form theme configuration
interface FormTheme {
    primaryColor: string;
    secondaryColor: string;
    layout: 'adaptive' | 'fixed' | 'fluid';
    fieldSpacing: 'tight' | 'medium' | 'loose';
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    animation: 'none' | 'smooth' | 'fast';
}

// Form submission configuration
interface FormSubmission {
    action: 'API_CALL' | 'REDIRECT' | 'CUSTOM';
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    successMessage?: string;
    errorMessage?: string;
    loadingMessage?: string;
    redirectOnSuccess?: string;
    validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

// Form validation configuration
interface FormValidationConfig {
    mode: 'progressive' | 'immediate' | 'onSubmit';
    showErrorsOn: 'blur' | 'change' | 'submit';
    validateOnChange: boolean;
    debounceMs: number;
}

// Accessibility configuration
interface AccessibilityConfig {
    announceValidationErrors: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    highContrastMode: 'auto' | 'enabled' | 'disabled';
}

// Analytics configuration
interface AnalyticsConfig {
    trackFieldInteractions: boolean;
    trackValidationErrors: boolean;
    trackFormAbandonment: boolean;
    trackStepCompletion: boolean;
}

// Localization configuration
interface LocalizationConfig {
    defaultLanguage: string;
    supportedLanguages: string[];
    dateFormat: 'auto' | string;
    numberFormat: 'auto' | string;
}

// Custom function configuration
interface CustomFunction {
    description: string;
    async: boolean;
    debounce?: number;
    cache?: boolean;
}

// Main form configuration interface
export interface FormConfig {
    // Basic form properties
    title: string;
    description?: string;
    type?: 'standard' | 'wizard';
    submitButtonLabel?: string;

    // Form structure
    steps?: FormStep[];
    fields: Field[];

    // Configuration objects
    theme?: FormTheme;
    onSubmit?: FormSubmission;
    validation?: FormValidationConfig;
    accessibility?: AccessibilityConfig;
    analytics?: AnalyticsConfig;
    localization?: LocalizationConfig;
    customFunctions?: Record<string, CustomFunction>;
}

// Props interface for the DynamicFormRenderer component
export interface DynamicFormRendererProps {
    formConfig: FormConfig;
    onSubmit?: (data: Record<string, any>) => void | Promise<void>;
    onChange?: (data: Record<string, any>) => void;
    onStepChange?: (step: number) => void;
    initialData?: Record<string, any>;
    disabled?: boolean;
    loading?: boolean;
}

// Form data types
export interface FormData {
    [key: string]: any;
}

export interface FormErrors {
    [key: string]: string;
}

// Validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: FormErrors;
}

// Field render props interface
export interface FieldRenderProps {
    field: Field;
    value: any;
    error?: string;
    onChange: (value: any) => void;
    onBlur: () => void;
    disabled?: boolean;
}



const DynamicFormRenderer = ({ formConfig }: DynamicFormRendererProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

    // ... previous useStates
    const [dynamicOptionsMap, setDynamicOptionsMap] = useState<{ [key: string]: FieldOption[] }>({});
    const [loadingOptionsMap, setLoadingOptionsMap] = useState<{ [key: string]: boolean }>({});

    // Add these state variables after your existing useState declarations
    const [flowStates, setFlowStates] = useState<{
        [fieldName: string]: {
            [stepId: string]: {
                value: string;
                options: FieldOption[];
                loading: boolean;
            }
        }
    }>({});

    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

    // Icon mapping for step icons
    const iconMap: { [key: string]: any } = {
        user: User,
        settings: Settings,
        shield: Shield,
        phone: Phone,
        mail: Mail,
        mapPin: MapPin,
        clock: Clock,
        palette: Palette,
        book: Book,
        heart: Heart,
        star: Star
    };

    // Initialize form data with default values
    useEffect(() => {
        const initializeFormData = () => {
            const initialData: { [key: string]: any } = {};

            const processFields = (fields: Field[]) => {
                fields.forEach((field) => {
                    if (field.type === 'dynamic-flow') {
                        initializeFlowField(field as DynamicFlowField);
                    } else if (field.type === 'section') {
                        processFields((field as SectionField).fields);
                    } else if (field.type === 'repeatable') {
                        initialData[field.name] = [{}];
                        processFields((field as RepeatableField).fields);
                    } else {
                        if (field.defaultValue !== undefined) {
                            initialData[field.name] = field.defaultValue;
                        } else if (field.type === 'checkbox' || field.type === 'multi-select') {
                            initialData[field.name] = [];
                        } else if (field.type === 'switch') {
                            initialData[field.name] = false;
                        }
                    }
                });
            };

            processFields(formConfig.fields);
            setFormData(initialData);
        };

        if (formConfig) {
            initializeFormData();
        }
    }, [formConfig]);

    // const getPopulationGroups = (val: any) => {
    //     console.log("Break", val, formData);

    //     return [
    //         { value: 'grp123', label: 'Gibberish Group A' },
    //         { value: 'grp456', label: 'Lorem Ipsum Group' },
    //         { value: 'grp789', label: 'FooBar Group' }
    //     ];
    // };
    // const getPopulationSubgroups = (val: string) => {
    //     console.log("Break1", val, formData);
    //     const subgroups: { [key: string]: FieldOption[] } = {
    //         'grp123': [
    //             { value: 'sub123', label: 'Subgibber A' },
    //             { value: 'sub456', label: 'Subipsum B' },
    //             { value: 'sub789', label: 'Subfoobar C' }
    //         ],
    //         "grp456": [
    //             { value: '123', label: 'Subgibber D' },
    //             { value: '456', label: 'Subipsum E' },
    //             { value: '789', label: 'Subfoobar F' }
    //         ],
    //         "grp789": [
    //             { value: 'ABC', label: 'Subgibber G' },
    //             { value: 'DEF', label: 'Subipsum H' },
    //             { value: 'GHI', label: 'Subfoobar I' }
    //         ]
    //     }
    //     return subgroups[val] || [];
    // };
    // const getPopulations = (val: any) => {
    //     console.log("Break2", val, formData);

    //     return [
    //         { value: 'pop123', label: 'PopGibber A' },
    //         { value: 'pop456', label: 'PopLorem B' },
    //         { value: 'pop789', label: 'PopFoo C' }
    //     ];
    // };

    // Validation functions

    // const mockDataFunctions = {
    //     getPopulationGroups: () => [
    //         { value: 'grp123', label: 'Medical Research Group' },
    //         { value: 'grp456', label: 'Clinical Trial Group' },
    //         { value: 'grp789', label: 'Survey Research Group' }
    //     ],
    //     getPopulationSubgroups: (groupId: string) => {
    //         const subgroups: { [key: string]: FieldOption[] } = {
    //             'grp123': [
    //                 { value: 'sub123', label: 'Adult Patients' },
    //                 { value: 'sub456', label: 'Pediatric Patients' },
    //                 { value: 'sub789', label: 'Elderly Patients' }
    //             ],
    //             'grp456': [
    //                 { value: 'sub123b', label: 'Phase I Participants' },
    //                 { value: 'sub456b', label: 'Phase II Participants' },
    //                 { value: 'sub789b', label: 'Phase III Participants' }
    //             ],
    //             'grp789': [
    //                 { value: 'sub123c', label: 'Healthcare Workers' },
    //                 { value: 'sub456c', label: 'General Public' },
    //                 { value: 'sub789c', label: 'Specialized Groups' }
    //             ]
    //         };
    //         return subgroups[groupId] || [];
    //     },
    //     getPopulations: (subgroupId: string) => {
    //         const populations: { [key: string]: FieldOption[] } = {
    //             'sub123': [
    //                 { value: 'pop123', label: 'Adults 18-65 with Diabetes' },
    //                 { value: 'pop456', label: 'Adults 18-65 with Hypertension' }
    //             ],
    //             'sub456': [
    //                 { value: 'pop789', label: 'Children 6-12 with Asthma' },
    //                 { value: 'pop101', label: 'Children 13-17 with ADHD' }
    //             ],
    //             'sub789': [
    //                 { value: 'pop102', label: 'Adults 65+ with Cardiovascular Disease' },
    //                 { value: 'pop103', label: 'Adults 65+ with Dementia' }
    //             ]
    //         };
    //         return populations[subgroupId] || [];
    //     },
    //     getDepartments: () => [
    //         { value: 'electronics', label: 'Electronics' },
    //         { value: 'clothing', label: 'Clothing' },
    //         { value: 'home', label: 'Home & Garden' }
    //     ],
    //     getCategories: (deptId: string) => {
    //         const categories: { [key: string]: FieldOption[] } = {
    //             'electronics': [
    //                 { value: 'phones', label: 'Mobile Phones' },
    //                 { value: 'computers', label: 'Computers' },
    //                 { value: 'audio', label: 'Audio & Video' }
    //             ],
    //             'clothing': [
    //                 { value: 'mens', label: "Men's Clothing" },
    //                 { value: 'womens', label: "Women's Clothing" },
    //                 { value: 'kids', label: "Kids' Clothing" }
    //             ]
    //         };
    //         return categories[deptId] || [];
    //     },
    //     getSubcategories: (catId: string) => {
    //         const subcategories: { [key: string]: FieldOption[] } = {
    //             'phones': [
    //                 { value: 'smartphones', label: 'Smartphones' },
    //                 { value: 'accessories', label: 'Phone Accessories' }
    //             ],
    //             'computers': [
    //                 { value: 'laptops', label: 'Laptops' },
    //                 { value: 'desktops', label: 'Desktop Computers' }
    //             ]
    //         };
    //         return subcategories[catId] || [];
    //     },
    //     getProducts: (subcatId: string) => {
    //         const products: { [key: string]: FieldOption[] } = {
    //             'smartphones': [
    //                 { value: 'iphone14', label: 'iPhone 14 Pro' },
    //                 { value: 'samsung-s23', label: 'Samsung Galaxy S23' }
    //             ],
    //             'laptops': [
    //                 { value: 'macbook-pro', label: 'MacBook Pro 16"' },
    //                 { value: 'dell-xps', label: 'Dell XPS 13' }
    //             ]
    //         };
    //         return products[subcatId] || [];
    //     }
    // };

    const toggleDropdown = (fieldName: string, forceClose = false) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [fieldName]: forceClose ? false : !prev[fieldName]
        }));
    };


    const validateField = useCallback((field: any, value: any, allData: any = formData) => {
        const fieldErrors: any = [];

        if (!field.validation || !shouldShowField(field)) return fieldErrors;

        // Required validation
        if (field.validation.required?.value) {
            if (!value || (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'string' && value.trim() === '')) {
                fieldErrors.push(field.validation.required.message);
            }
        }

        if (value && typeof value === 'string') {
            // Min length validation
            if (field.validation.minLength && value.length < field.validation.minLength.value) {
                fieldErrors.push(field.validation.minLength.message);
            }

            // Max length validation
            if (field.validation.maxLength && value.length > field.validation.maxLength.value) {
                fieldErrors.push(field.validation.maxLength.message);
            }

            // Pattern validation
            if (field.validation.pattern) {
                const regex = new RegExp(field.validation.pattern.value);
                if (!regex.test(value)) {
                    fieldErrors.push(field.validation.pattern.message);
                }
            }
        }

        // Number validations
        if (field.type === 'number' && value) {
            if (field.validation.min && Number(value) < field.validation.min.value) {
                fieldErrors.push(field.validation.min.message);
            }
            if (field.validation.max && Number(value) > field.validation.max.value) {
                fieldErrors.push(field.validation.max.message);
            }
        }

        // Custom validations (simplified)
        if (field.validation.custom) {
            const customValidation = field.validation.custom;

            // Password strength validation
            if (customValidation.function === 'validatePasswordStrength' && value) {
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
                    fieldErrors.push(customValidation.message);
                }
            }

            // Password match validation
            if (customValidation.function === 'validatePasswordMatch' && field.name === 'confirmPassword') {
                if (value !== allData.password) {
                    fieldErrors.push(customValidation.message);
                }
            }

            // Full name validation
            if (customValidation.function === 'validateFullName' && value) {
                const func = customValidation.function;
                if (eval(`${func}(value)`))
                    fieldErrors.push(customValidation.message);
            }
        }

        // Add this case in your validation logic
        if (field.type === 'dynamic-flow') {
            const flowField = field as DynamicFlowField;
            const outputValue = formData[flowField.name];

            if (flowField.validation?.required?.value && !outputValue) {
                fieldErrors.push(flowField.validation.required.message || `${flowField.label} is required`);
            }
        }

        return fieldErrors;
    }, [formData]);

    // Dynamic options loading function
    const loadOptions = useCallback(async (optionsSource: OptionsSource, dependsOnValue: any = null) => {
        // switch (optionsSource.function) {
        //     case 'getCountryStates':
        //         return getCountryStates(dependsOnValue);
        //     case 'getCities':
        //         return getCities(dependsOnValue);
        //     default:
        //         return [
        //         { value: 'grp123', label: 'Gibberish Group A' },
        //         { value: 'grp456', label: 'Lorem Ipsum Group' },
        //         { value: 'grp789', label: 'FooBar Group' }
        //     ];
        // }

        const callableFunction = functionsMap[optionsSource.function];
        return await callableFunction(dependsOnValue);
        // return eval(`${optionsSource.function}(dependsOnValue)`);
    }, []);

    const loadStepOptions = useCallback(async (
        fieldName: string,
        step: FlowStep,
        dependsOnValue?: string
    ) => {
        const functionName = step.optionsSource.function as keyof typeof functionsMap;
        const loadFunction = functionsMap[functionName];

        if (!loadFunction) {
            console.warn(`Function ${functionName} not found`);
            return [];
        }

        // Update loading state
        setFlowStates(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [step.id]: {
                    ...prev[fieldName]?.[step.id],
                    loading: true
                }
            }
        }));

        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));

            const options = dependsOnValue
                ? (loadFunction as any)(dependsOnValue)
                : (loadFunction as any)();

            setFlowStates(prev => ({
                ...prev,
                [fieldName]: {
                    ...prev[fieldName],
                    [step.id]: {
                        ...prev[fieldName]?.[step.id],
                        options: options || [],
                        loading: false
                    }
                }
            }));

            return options || [];
        } catch (error) {
            console.error(`Error loading options for ${step.id}:`, error);
            setFlowStates(prev => ({
                ...prev,
                [fieldName]: {
                    ...prev[fieldName],
                    [step.id]: {
                        ...prev[fieldName]?.[step.id],
                        options: [],
                        loading: false
                    }
                }
            }));
            return [];
        }
    }, []);

    // Initialize flow field
    const initializeFlowField = useCallback((field: DynamicFlowField) => {
        const initialState: any = {};

        field.flow.forEach(step => {
            initialState[step.id] = {
                value: '',
                options: [],
                loading: false
            };
        });

        setFlowStates(prev => ({
            ...prev,
            [field.name]: initialState
        }));

        // Load options for the first step (which has no dependencies)
        const firstStep = field.flow[0];
        if (firstStep && !firstStep.optionsSource.dependsOn) {
            loadStepOptions(field.name, firstStep);
        }
    }, [loadStepOptions]);

    const validateStep = useCallback((
        fieldName: string,
        step: FlowStep,
        currentFlowStates: any
    ) => {
        const stepState = currentFlowStates[fieldName]?.[step.id];
        if (!stepState) return '';

        if (step.validation?.required?.value && !stepState.value) {
            return step.validation.required.message || `${step.label} is required`;
        }
        return '';
    }, []);

    // Handle flow step change
    // const handleFlowStepChange = useCallback((
    //     fieldName: string,
    //     stepId: string,
    //     value: string,
    //     field: DynamicFlowField
    // ) => {
    //     const stepIndex = field.flow.findIndex(step => step.id === stepId);
    //     const currentStep = field.flow[stepIndex];

    //     if (!currentStep) return;

    //     // Update the current step's value
    //     setFlowStates(prev => ({
    //         ...prev,
    //         [fieldName]: {
    //             ...prev[fieldName],
    //             [stepId]: {
    //                 ...prev[fieldName]?.[stepId],
    //                 value
    //             }
    //         }
    //     }));

    //     // Reset all subsequent steps
    //     const subsequentSteps = field.flow.slice(stepIndex + 1);
    //     setFlowStates(prev => {
    //         const newState = { ...prev };
    //         subsequentSteps.forEach(step => {
    //             if (newState[fieldName]?.[step.id]) {
    //                 newState[fieldName][step.id] = {
    //                     value: '',
    //                     options: [],
    //                     loading: false
    //                 };
    //             }
    //         });
    //         return newState;
    //     });

    //     // Load options for the next step if value is selected
    //     if (value && stepIndex < field.flow.length - 1) {
    //         const nextStep = field.flow[stepIndex + 1];
    //         if (nextStep.optionsSource.dependsOn === stepId) {
    //             loadStepOptions(fieldName, nextStep, value);
    //         }
    //     }

    //     // Update the main form data with the output value
    //     if (stepId === field.outputStepId) {
    //         setFormData(prev => ({
    //             ...prev,
    //             [fieldName]: value
    //         }));
    //     } else if (field.outputStepId === subsequentSteps[0]?.id) {
    //         // If we changed a step that affects the output, clear the output
    //         setFormData(prev => ({
    //             ...prev,
    //             [fieldName]: ''
    //         }));
    //     }

    //     const changedStep = field.flow.find(s => s.id === stepId);
    //     if (changedStep) {
    //         const validationMessage = validateStep(changedStep);
    //         setErrors(prevErrors => {
    //             const newErrors = { ...prevErrors };
    //             const errorKey = `${fieldName}.${stepId}`;
    //             if (validationMessage) {
    //                 newErrors[errorKey] = validationMessage;
    //             } else {
    //                 delete newErrors[errorKey];
    //             }
    //             return newErrors;
    //         });
    //     }

    //     subsequentSteps.forEach(step => {
    //         setErrors(prevErrors => {
    //             const newErrors = { ...prevErrors };
    //             const errorKey = `${fieldName}.${step.id}`;
    //             if (newErrors[errorKey]) {
    //                 delete newErrors[errorKey];
    //             }
    //             return newErrors;
    //         });
    //     });

    // }, [loadStepOptions, validateField, flowStates]);

    const handleFlowStepChange = useCallback((
        fieldName: string,
        stepId: string,
        value: string,
        field: DynamicFlowField
    ) => {
        const stepIndex = field.flow.findIndex(step => step.id === stepId);
        const currentStepConfig = field.flow[stepIndex];

        if (!currentStepConfig) return;

        // Temporarily store the new flow state to pass to validateStep immediately
        let newFlowStatesForValidation = { ...flowStates };

        // Update the current step's value
        newFlowStatesForValidation = {
            ...newFlowStatesForValidation,
            [fieldName]: {
                ...newFlowStatesForValidation[fieldName],
                [stepId]: {
                    ...newFlowStatesForValidation[fieldName]?.[stepId],
                    value
                }
            }
        };

        // Reset all subsequent steps
        const subsequentSteps = field.flow.slice(stepIndex + 1);
        subsequentSteps.forEach(step => {
            if (newFlowStatesForValidation[fieldName]?.[step.id]) {
                newFlowStatesForValidation[fieldName][step.id] = {
                    value: '',
                    options: [],
                    loading: false
                };
            }
        });

        // Set the full updated flowStates
        setFlowStates(newFlowStatesForValidation);

        // Load options for the next step if value is selected
        if (value && stepIndex < field.flow.length - 1) {
            const nextStep = field.flow[stepIndex + 1];
            if (nextStep.optionsSource.dependsOn === stepId) {
                loadStepOptions(fieldName, nextStep, value);
            }
        }

        // Update the main form data with the output value
        if (stepId === field.outputStepId) {

            setFormData(prev => ({
                ...prev,
                [fieldName]: value
            }));

            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                const errorKey = `${fieldName}`;

                delete newErrors[errorKey];
                return newErrors;
            });

        } else {

            setFormData(prev => ({
                ...prev,
                [fieldName]: ''
            }));
        }

        const stepValidationMessage = validateStep(fieldName, currentStepConfig, newFlowStatesForValidation); // Call the moved validateStep
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            const errorKey = `${fieldName}.${stepId}`;
            if (stepValidationMessage) {
                newErrors[errorKey] = stepValidationMessage;
            } else {
                delete newErrors[errorKey];
            }
            return newErrors;
        });



        subsequentSteps.forEach(step => {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                const errorKey = `${fieldName}.${step.id}`;
                if (newErrors[errorKey]) {
                    delete newErrors[errorKey];
                }
                return newErrors;
            });
        });

        console.log("value", value);
        console.log("form data", formData[field.name]);



    }, [loadStepOptions, validateStep, validateField, flowStates, setErrors, setFormData]);

    useEffect(() => {
        // Find all select fields (including in sections/repeatable) which have optionsSource
        const loadFieldsOptions = (fields: Field[], parentName?: string) => {
            fields.forEach((field) => {
                if (field.type === "section") {
                    loadFieldsOptions((field as SectionField).fields, parentName);
                } else if (field.type === "repeatable") {
                    loadFieldsOptions((field as RepeatableField).fields as Field[], field.name);
                } else if (
                    field.type === "select" &&
                    field.optionsSource
                ) {
                    const name = field.name;

                    // Determine dependsOn value (get from formData, considering repeatable parent is not supported here)
                    let dependsOnValue = undefined;
                    if (field.optionsSource.dependsOn) {
                        dependsOnValue = formData[field.optionsSource.dependsOn as string];
                    }

                    // Only reload if dependsOnValue changes (could add more advanced logic)
                    setLoadingOptionsMap((prev) => ({ ...prev, [name]: true }));
                    Promise.resolve(loadOptions(field.optionsSource!, dependsOnValue)).then((opts) => {
                        setDynamicOptionsMap((prev) => ({ ...prev, [name]: opts }));
                        setLoadingOptionsMap((prev) => ({ ...prev, [name]: false }));
                    });
                }
            });
        };

        if (formConfig && formConfig.fields) {
            loadFieldsOptions(formConfig.fields);
        }

    }, [formConfig, formData, loadOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.multi-select-dropdown')) {
                setOpenDropdowns({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Close all dropdowns when moving between form steps or major changes
        setOpenDropdowns({});
    }, [currentStep]);

    // Mock functions for dynamic options (replace with your actual API calls)
    const getCountryStates = (countryCode: string): FieldOption[] => {
        const statesByCountry: { [key: string]: FieldOption[] } = {
            'us': [
                { value: 'CA', label: 'California' },
                { value: 'NY', label: 'New York' },
                { value: 'TX', label: 'Texas' },
                { value: 'FL', label: 'Florida' }
            ],
            'ca': [
                { value: 'ON', label: 'Ontario' },
                { value: 'BC', label: 'British Columbia' },
                { value: 'AB', label: 'Alberta' },
                { value: 'QC', label: 'Quebec' }
            ],
            'in': [
                { value: 'MH', label: 'Maharashtra' },
                { value: 'KA', label: 'Karnataka' },
                { value: 'TN', label: 'Tamil Nadu' },
                { value: 'GJ', label: 'Gujarat' }
            ],
            'uk': [
                { value: 'ENG', label: 'England' },
                { value: 'SCT', label: 'Scotland' },
                { value: 'WLS', label: 'Wales' },
                { value: 'NIR', label: 'Northern Ireland' }
            ],
            'au': [
                { value: 'NSW', label: 'New South Wales' },
                { value: 'VIC', label: 'Victoria' },
                { value: 'QLD', label: 'Queensland' },
                { value: 'WA', label: 'Western Australia' }
            ]
        };
        return statesByCountry[countryCode] || [];
    };

    const getCities = (stateCode: string): FieldOption[] => {
        const citiesByState: { [key: string]: FieldOption[] } = {
            'CA': [
                { value: 'LA', label: 'Los Angeles' },
                { value: 'SF', label: 'San Francisco' },
                { value: 'SD', label: 'San Diego' }
            ],
            'NY': [
                { value: 'NYC', label: 'New York City' },
                { value: 'ALB', label: 'Albany' },
                { value: 'BUF', label: 'Buffalo' }
            ],
            'MH': [
                { value: 'MUM', label: 'Mumbai' },
                { value: 'PUN', label: 'Pune' },
                { value: 'NAG', label: 'Nagpur' }
            ],
            'KA': [
                { value: 'BLR', label: 'Bangalore' },
                { value: 'MYS', label: 'Mysore' },
                { value: 'MNG', label: 'Mangalore' }
            ]
        };
        return citiesByState[stateCode] || [];
    };

    const validateFullName = (value: any) => {
        console.log(value, "inside validate function");
        const nameParts: string[] = value.trim().split(' ');

        if (nameParts.length < 2 || nameParts.some(part => part.length === 0)) {
            return true;
        }
        return false;
    }

    // Check if field should be shown based on conditions
    const shouldShowField = useCallback((field: Field, repeatableParent?: string, index?: number) => {
        if (!field.showWhen) return true;

        const { conditions, logic = 'and' } = field.showWhen;

        const results = conditions.map(condition => {
            let fieldValue;

            if (repeatableParent && index !== undefined) {
                // For repeatable fields, check within the current item
                fieldValue = formData[repeatableParent]?.[index]?.[condition.field] ?? formData[condition.field];
            } else {
                fieldValue = formData[condition.field];
            }

            switch (condition.operator) {
                case 'eq':
                    return fieldValue === condition.value;
                case 'neq':
                    return fieldValue !== condition.value;
                case 'in':
                    return Array.isArray(condition.value) && condition.value.includes(fieldValue);
                case 'notIn':
                    return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
                case 'gt':
                    return Number(fieldValue) > Number(condition.value);
                case 'lt':
                    return Number(fieldValue) < Number(condition.value);
                case 'gte':
                    return Number(fieldValue) >= Number(condition.value);
                case 'lte':
                    return Number(fieldValue) <= Number(condition.value);
                default:
                    return false;
            }
        });

        return logic === 'and' ? results.every(Boolean) : results.some(Boolean);
    }, [formData]);

    // Handle input changes
    const handleInputChange = (fieldName: string, value: any, repeatableParent?: string, index?: number) => {
        setFormData(prev => {
            const newData = { ...prev };

            if (repeatableParent && index !== undefined) {
                // Handle repeatable fields - store data in parent array
                if (!newData[repeatableParent]) newData[repeatableParent] = [];
                if (!newData[repeatableParent][index]) newData[repeatableParent][index] = {};
                newData[repeatableParent][index][fieldName] = value;
            } else {
                newData[fieldName] = value;
            }

            return newData;
        });

        // Clear field error when user starts typing
        const errorKey = repeatableParent && index !== undefined
            ? `${repeatableParent}.${index}.${fieldName}`
            : fieldName;

        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    // Handle field blur for validation
    const handleFieldBlur = (field: any, repeatableParent?: string, index?: number) => {
        const fieldValue = repeatableParent && index !== undefined
            ? formData[repeatableParent]?.[index]?.[field.name]
            : formData[field.name];

        const fieldErrors = validateField(field, fieldValue);

        if (fieldErrors.length > 0) {
            const errorKey = repeatableParent && index !== undefined
                ? `${repeatableParent}.${index}.${field.name}`
                : field.name;

            setErrors(prev => ({
                ...prev,
                [errorKey]: fieldErrors[0]
            }));
        }
    };

    // Get password strength
    const getPasswordStrength = (password: string, minLength: number) => {
        if (!password) return { strength: 0, label: 'No password', color: 'bg-gray-300' };

        let strength = 0;
        if (password.length >= minLength) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-700'];

        return {
            strength,
            label: labels[strength] || 'Very Weak',
            color: colors[strength] || 'bg-gray-300'
        };
    };

    // Render individual field
    const renderField = (field: Field, repeatableParent?: string, repeatableIndex?: number) => {
        const fieldValue = repeatableParent && repeatableIndex !== undefined
            ? formData[repeatableParent]?.[repeatableIndex]?.[field.name] || ''
            : formData[field.name] || '';

        if (!shouldShowField(field, repeatableParent, repeatableIndex)) return null;

        const errorKey = repeatableParent && repeatableIndex !== undefined
            ? `${repeatableParent}.${repeatableIndex}.${field.name}`
            : field.name;
        const hasError = errors[errorKey];
        const commonClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus: border-blue-500 transition-colors ${hasError ? 'border-red-500' : 'border-gray-300'
            }`;

        let selectOptions: FieldOption[] = [];
        let loadingOptions = false;
        if (field.type === "select" && field.optionsSource) {
            selectOptions = dynamicOptionsMap[field.name] || [];
            loadingOptions = loadingOptionsMap[field.name] || false;
        } else if (field.type === "select" && field.options) {
            selectOptions = field.options;
            loadingOptions = false;
        }

        const renderFieldContent = () => {
            switch (field.type) {
                case 'text':
                case 'email':
                    return (
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                            onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                            className={commonClasses}
                        />
                    );

                case 'number':
                    return (
                        <input
                            type="number"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                            onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                            className={commonClasses}
                        />
                    );

                case 'date':
                    return (
                        <input
                            type="date"
                            name={field.name}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                            onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                            className={commonClasses}
                        />
                    );

                case 'tel':
                    return (
                        <input
                            type="tel"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                            onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                            className={commonClasses}
                        />
                    );

                case 'password':
                    const showPassword = showPasswords[field.name];
                    const minLength: number = field.validation?.minLength?.value ?? 8;
                    const passwordStrength = field.showPasswordStrength ? getPasswordStrength(fieldValue, minLength) : null;

                    return (
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={fieldValue}
                                    onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                                    onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                                    className={`${commonClasses} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordStrength && fieldValue && (
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600">{passwordStrength.label + passwordStrength.strength}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );

                case 'textarea':
                    const charCount = fieldValue.length;
                    const maxLength = field.validation?.maxLength?.value;

                    return (
                        <div className="space-y-2">
                            <textarea
                                name={field.name}
                                placeholder={field.placeholder}
                                value={fieldValue}
                                onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                                onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                                rows={4}
                                className={commonClasses}
                            />
                            {field.characterCounter && maxLength && (
                                <div className="text-sm text-gray-500 text-right">
                                    {charCount}/{maxLength}
                                </div>
                            )}
                        </div>
                    );

                case 'select':

                    return (
                        <select
                            name={field.name}
                            value={fieldValue}
                            onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                            onBlur={() => handleFieldBlur(field, repeatableParent, repeatableIndex)}
                            className={commonClasses}
                            disabled={loadingOptions}
                        >
                            <option value="" disabled>
                                {loadingOptions ? 'Loading...' : field.placeholder || 'Select an option'}
                            </option>
                            {(field.optionsSource ? selectOptions : field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    );

                case 'multi-select':
                    const selectedMultiValues = Array.isArray(fieldValue) ? fieldValue : [];
                    const availableOptions = field.optionsSource ? selectOptions : (field.options || []);
                    const isDropdownOpen = openDropdowns[field.name] || false;

                    return (
                        <div className="relative multi-select-container">
                            {/* Selected Values Display */}
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleDropdown(field.name);
                                }}
                                className={`${commonClasses} cursor-pointer flex items-center justify-between min-h-[42px]`}
                            >
                                <div className="flex-1">
                                    {selectedMultiValues.length === 0 ? (
                                        <span className="text-gray-500">
                                            {loadingOptions ? 'Loading...' : field.placeholder || 'Select options'}
                                        </span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedMultiValues.map((value) => {
                                                const option = availableOptions.find(opt => opt.value === value);
                                                return (
                                                    <span
                                                        key={value}
                                                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                    >
                                                        {option?.label || value}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const newValue = selectedMultiValues.filter(v => v !== value);
                                                                handleInputChange(field.name, newValue, repeatableParent, repeatableIndex);
                                                            }}
                                                            className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight
                                    size={16}
                                    className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`}
                                />
                            </div>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop - lower z-index */}
                                    <div
                                        className="fixed inset-0 z-[5] bg-transparent"
                                        onClick={() => toggleDropdown(field.name, true)}
                                    />

                                    <div
                                        className="absolute z-[20] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto multi-select-dropdown"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {loadingOptions ? (
                                            <div className="p-3 text-center text-gray-500">Loading...</div>
                                        ) : availableOptions.length === 0 ? (
                                            <div className="p-3 text-center text-gray-500">No options available</div>
                                        ) : (
                                            <div className="p-2 space-y-1">
                                                {/* Select All / Clear All */}
                                                <div className="flex items-center justify-between p-2 border-b border-gray-200">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const allValues = availableOptions.map(opt => opt.value);
                                                            handleInputChange(field.name, allValues, repeatableParent, repeatableIndex);
                                                        }}
                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        Select All
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInputChange(field.name, [], repeatableParent, repeatableIndex);
                                                        }}
                                                        className="text-xs text-gray-600 hover:text-gray-800"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>

                                                {/* Options List */}
                                                {availableOptions.map((option) => {
                                                    const isSelected = selectedMultiValues.includes(option.value);
                                                    return (
                                                        <label
                                                            key={option.value}
                                                            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    const newValue = e.target.checked
                                                                        ? [...selectedMultiValues, option.value]
                                                                        : selectedMultiValues.filter(v => v !== option.value);
                                                                    handleInputChange(field.name, newValue, repeatableParent, repeatableIndex);
                                                                }}
                                                                className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm">{option.label}</div>
                                                                {option.description && (
                                                                    <div className="text-xs text-gray-500">{option.description}</div>
                                                                )}
                                                            </div>
                                                            {option.icon && (
                                                                <span className="ml-2 text-gray-400">{option.icon}</span>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Click outside to close */}
                            {isDropdownOpen && (
                                <div
                                    className="fixed inset-0 z-5"
                                    onClick={() => toggleDropdown(field.name)}
                                />
                            )}
                        </div>
                    );
                case 'radio':
                    return (
                        <div className="space-y-2">
                            {field.options?.map((option) => (
                                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={option.value}
                                        checked={fieldValue === option.value}
                                        onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                                        className="mt-1 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    );

                case 'checkbox':
                    const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];

                    return (
                        <div className={`grid gap-3 ${field.columns ? `grid-cols-${field.columns}` : 'grid-cols-1'}`}>
                            {
                                field.options?.map((option) => (
                                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            checked={selectedValues.includes(option.value)}
                                            onChange={(e) => {
                                                const newValue = e.target.checked
                                                    ? [...selectedValues, option.value]
                                                    : selectedValues.filter(v => v !== option.value);
                                                handleInputChange(field.name, newValue, repeatableParent, repeatableIndex);
                                            }}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center space-x-2">
                                            {option.icon && <span>{option.icon}</span>}
                                            <span>{option.label}</span>
                                        </div>
                                    </label>
                                ))
                            }
                        </div >
                    );

                case 'switch':
                    return (
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={fieldValue}
                                    onChange={(e) => handleInputChange(field.name, e.target.checked, repeatableParent, repeatableIndex)}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${fieldValue ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${fieldValue ? 'transform translate-x-6' : ''}`} />
                                </div>
                            </div>
                        </label >
                    );

                case 'color':
                    return (
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                name={field.name}
                                value={fieldValue}
                                onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => handleInputChange(field.name, e.target.value, repeatableParent, repeatableIndex)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="#000000"
                            />
                            {field.presetColors && (
                                <div className="flex space-x-1">
                                    {field.presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleInputChange(field.name, color, repeatableParent, repeatableIndex)}
                                            className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );

                case 'file':
                    return (
                        <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-2">
                                    <label className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Choose file or drag and drop
                                        </span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => {
                                                if (e.target.files?.length) {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleInputChange(field.name, file, repeatableParent, repeatableIndex);
                                                    }
                                                }
                                            }}
                                            accept={field.validation?.allowedTypes?.join(',')}
                                        />
                                    </label>
                                </div>
                            </div>
                            {fieldValue && typeof fieldValue === 'object' && fieldValue.name && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-700">{fieldValue.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange(field.name, '', repeatableParent, repeatableIndex)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );

                case 'dynamic-flow':
                    return renderDynamicFlowField(field as DynamicFlowField);

                default:
                    return null;
            }
        };

        return (
            <div className="space-y-2">
                <label className="block">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">{field.label}</span>
                        {field.tooltip && (
                            <div className="relative group">
                                <Info size={16} className="text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {field.tooltip}
                                </div>
                            </div>
                        )}
                    </div>
                    {renderFieldContent()}
                </label>

                {field.helpText && (
                    <p className="text-sm text-gray-500">{field.helpText}</p>
                )}

                {hasError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        <span>{hasError}</span>
                    </div>
                )}
            </div>
        );
    };

    // Render section
    const renderSection = (section: SectionField) => {
        const visibleFields: Field[] = section.fields.filter(field => shouldShowField(field));
        if (visibleFields.length === 0) return null;

        return (
            <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{section.title}</span>
                    </h3>
                    {section.description && (
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    )}
                </div>

                <div className={`grid gap-6 ${section.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {visibleFields.map((field, index) => (
                        <div key={field.name}>
                            {renderField(field)}
                        </div>
                    ))}
                </div>
            </div >
        );
    };

    // Render repeatable section
    const renderRepeatableSection = (section: RepeatableField) => {
        const items: any[] = formData[section.name] || [{}];

        return (
            <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{section.sectionTitle}</h3>
                        {section.description && (
                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        )}
                    </div>
                    {items.length < (section.maxItems || 10) && (
                        <button
                            type="button"
                            onClick={() => {
                                const newItems = [...items, {}];
                                handleInputChange(section.name, newItems);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus size={16} className="mr-1" />
                            {section.addButtonLabel || 'Add Item'}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newItems = items.filter((_, i) => i !== index);
                                            handleInputChange(section.name, newItems);

                                            // Clean up errors for removed item
                                            const newErrors = { ...errors };
                                            Object.keys(newErrors).forEach(key => {
                                                if (key.startsWith(`${section.name}.${index}.`)) {
                                                    delete newErrors[key];
                                                }
                                            });
                                            setErrors(newErrors);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {section.fields.map((field) => (
                                    <div key={field.name}>
                                        {renderField(field, section.name, index)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render dynamic flow field
    const renderDynamicFlowField = (field: DynamicFlowField) => {
        const flowState = flowStates[field.name] || {};
        const hasError = errors[field.name];

        const getStepError = (stepId: string) => {
            return errors[`${field.name}.${stepId}`];
        };

        const isStepEnabled = (stepIndex: number) => {
            if (stepIndex === 0) return true;

            const previousStep = field.flow[stepIndex - 1];
            const previousStepState = flowState[previousStep.id];

            return previousStepState?.value ? true : false;
        };

        return (
            <div className="space-y-4">
                {/* <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    {field.helpText && (
                        <div className="relative group">
                            <Info size={16} className="text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {field.helpText}
                            </div>
                        </div>
                    )}
                </div> */}

                <div className={`space-y-4 ${field.flowLayout === 'grid' ? 'md:grid md:grid-cols-2 md:gap-4 md:space-y-0' : ''}`}>
                    {field.flow.map((step, index) => {
                        const stepState = flowState[step.id] || { value: '', options: [], loading: false };
                        const isEnabled = isStepEnabled(index);
                        const stepError = getStepError(step.id);
                        const showStep = field.showAllSteps || isEnabled;

                        if (!showStep) return null;

                        return (
                            <div key={step.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {step.label}
                                </label>

                                <div className="relative">
                                    <select
                                        value={stepState.value}
                                        onChange={(e) => handleFlowStepChange(field.name, step.id, e.target.value, field)}
                                        disabled={!isEnabled || stepState.loading}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${stepError ? 'border-red-500' : 'border-gray-300'
                                            } ${!isEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="" disabled>
                                            {stepState.loading
                                                ? 'Loading...'
                                                : !isEnabled
                                                    ? 'Please select previous option first'
                                                    : step.placeholder || 'Select an option'
                                            }
                                        </option>
                                        {stepState.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    {stepState.loading && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <RefreshCw size={16} className="animate-spin text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {step.helpText && isEnabled && (
                                    <p className="text-sm text-gray-500">{step.helpText}</p>
                                )}

                                {stepError && (
                                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                                        <AlertCircle size={16} />
                                        <span>{stepError}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* {hasError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                        <AlertCircle size={16} />
                        <span>{hasError}</span>
                    </div>
                )} */}

                {/* Show current selection path */}
                {
                    Object.values(flowState).some(state => state.value) && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-800">
                                <strong>Selection Path:</strong>{' '}
                                {field.flow
                                    .filter(step => flowState[step.id]?.value)
                                    .map(step => {
                                        const option = flowState[step.id]?.options.find(
                                            opt => opt.value === flowState[step.id]?.value
                                        );
                                        return option?.label || flowState[step.id]?.value;
                                    })
                                    .join(' → ')
                                }
                            </div>
                            {formData[field.name] && (
                                <div className="text-sm text-green-700 mt-1">
                                    <strong>Selected Value:</strong> {formData[field.name]}
                                </div>
                            )}
                        </div>
                    )}
            </div>
        );
    };

    // Get current step fields
    const getCurrentStepFields = () => {
        if (!formConfig.steps) return formConfig.fields;

        const currentStepConfig = formConfig.steps[currentStep];
        return formConfig.fields.filter(field =>
            currentStepConfig.fields.includes(field.name)
        );
    };

    // Validate current step
    const validateCurrentStep = () => {
        const stepFields: Field[] = getCurrentStepFields();
        const stepErrors: any = {};

        const validateFieldsRecursively = (fields: Field[], prefix = '') => {
            fields.forEach(field => {
                if (field.type === 'section') {
                    validateFieldsRecursively((field as SectionField).fields, prefix);
                } else if (field.type === 'repeatable') {
                    const items: any[] = formData[field.name] || [];
                    items.forEach((item, index) => {
                        (field as RepeatableField).fields.forEach(subField => {
                            const subFieldValue = item[subField.name] || '';
                            const fieldErrors = validateField(subField, subFieldValue, item);
                            if (fieldErrors.length > 0) {
                                stepErrors[`${field.name}.${index}.${subField.name}`] = fieldErrors[0];
                            }
                        });
                    });

                    // Validate repeatable field constraints
                    if (field.validation?.min && items.length < field.validation.min.value) {
                        stepErrors[field.name] = field.validation.min.message;
                    }
                    if (field.validation?.max && items.length > field.validation.max.value) {
                        stepErrors[field.name] = field.validation.max.message;
                    }
                } else if (field.type === 'dynamic-flow') {
                    const dynamicFlowField = field as DynamicFlowField;
                    let flowHasErrors = false;

                    dynamicFlowField.flow.forEach(step => {
                        // Call the moved validateStep function
                        const stepError = validateStep(dynamicFlowField.name, step, flowStates);
                        if (stepError) {
                            stepErrors[`${dynamicFlowField.name}.${step.id}`] = stepError;
                            flowHasErrors = true;
                        }
                    });

                    // Also validate the overall dynamic-flow field's output if it has its own validation
                    const fieldErrors = validateField(dynamicFlowField, formData[dynamicFlowField.name]);
                    if (fieldErrors.length > 0) {
                        // Only add if you want an overall error for the flow field,
                        // in addition to specific step errors.
                        stepErrors[dynamicFlowField.name] = fieldErrors[0];
                        flowHasErrors = true;
                    }
                } else {
                    const fieldErrors = validateField(field, formData[field.name]);
                    if (fieldErrors.length > 0) {
                        stepErrors[field.name] = fieldErrors[0];
                    }
                }
            });
        };

        validateFieldsRecursively(stepFields);
        setErrors(stepErrors);

        return Object.keys(stepErrors).length === 0;
    };

    // Handle step navigation
    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, (formConfig.steps?.length ?? 1) - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData);
        console.log(errors);

        if (!validateCurrentStep()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert(formConfig.onSubmit?.successMessage || 'Form submitted successfully!');

            // Reset form
            setFormData({});
            setCurrentStep(0);
            setErrors({});
            setFlowStates({});
        } catch (error) {
            alert(formConfig.onSubmit?.errorMessage || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!formConfig) {
        return <div className="p-8 text-center">No form configuration provided</div>;
    }

    const isWizard = formConfig.type === 'wizard' && formConfig.steps;
    const currentStepFields = getCurrentStepFields();

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                {/* Form Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{formConfig.title}</h1>
                    <p className="text-gray-600">{formConfig.description}</p>
                </div>

                {/* Step Navigation */}
                {isWizard && (
                    <>
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                {formConfig.steps?.map((step, index) => {
                                    const StepIcon = iconMap[step.icon ?? "user"] || User;
                                    const isActive = index === currentStep;
                                    const isCompleted = index < currentStep;

                                    return (
                                        <div key={step.id} className="flex items-center">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                isActive ? 'bg-blue-500 border-blue-500 text-white' :
                                                    'bg-gray-200 border-gray-300 text-gray-500'
                                                }`}>
                                                {isCompleted ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                                            </div>

                                            <div className="ml-3 min-w-0 flex-1">
                                                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    {step.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{step.description}</p>
                                            </div>

                                            {index < (formConfig.steps?.length ?? 1) - 1 && (
                                                <ChevronRight className="mx-4 text-gray-400" size={20} />
                                            )}
                                        </div>

                                    );
                                })}
                            </div>

                            <div className="mt-4 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / (formConfig.steps?.length ?? 1)) * 100}% ` }}
                                />
                            </div>
                        </div >
                    </>
                )}

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStepFields.map((field) => {
                        if (field.type === 'section') {
                            return <div key={field.name}>{renderSection(field as SectionField)}</div>;
                        } else if (field.type === 'repeatable') {
                            return <div key={field.name}>{renderRepeatableSection(field as RepeatableField)}</div>;
                        } else {
                            return (
                                <div key={field.name} className="p-6 bg-white rounded-lg border border-gray-200">
                                    {renderField(field)}
                                </div>
                            );
                        }
                    })}

                    {/* Form Navigation */}
                    <div className="flex items-center justify-between pt-6">
                        {isWizard ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} className="mr-1" />
                                    Previous
                                </button>

                                {currentStep === (formConfig.steps?.length ?? 1) - 1 ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                {formConfig.onSubmit?.loadingMessage || 'Submitting...'}
                                            </>
                                        ) : (
                                            <>
                                                <Check size={16} className="mr-2" />
                                                {formConfig.submitButtonLabel || 'Submit'}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Next
                                        <ChevronRight size={16} className="ml-1" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        {formConfig.onSubmit?.loadingMessage || 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} className="mr-2" />
                                        {formConfig.submitButtonLabel || 'Submit'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div >

        </>
    );
};

export default DynamicFormRenderer;