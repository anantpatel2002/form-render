import { FieldOption } from "@/app/_components/form-renderer";

export type OptionItem = { label: string; value: string | number; [k: string]: any };
export type FormFunctionContext = { formValues?: Record<string, any>; fieldMeta?: any; fetcher?: typeof fetch };
export type FormFunction = (...args: any[]) => Promise<FieldOption[]> | FieldOption[];