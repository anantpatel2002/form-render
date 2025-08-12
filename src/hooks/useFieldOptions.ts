import React from "react";
import { callFormFunction } from "@/lib/dynamicFunctionLoader"; // your loader
import { OptionItem } from "@/types/formFunctions";
import { OptionsSource } from "@/app/_components/form-renderer";

// export type OptionItem = { value: string | number; label: string; [k: string]: any };

// type OptionsSource = {
//   function: string;
//   dependsOn?: string | string[];
//   params?: string[]; // optional explicit param order
//   cache?: boolean;
// };

export function useFieldOptions({
    field,
    formValues,
    enabled = true,
    query,
}: {
    field: any;
    formValues: Record<string, any>;
    enabled?: boolean;
    query?: string;
}) {
    const [options, setOptions] = React.useState<OptionItem[]>(
        Array.isArray(field?.options) ? field.options : []
    );
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<any>(null);

    const src: OptionsSource | undefined = field?.optionsSource;

    // resolve depends values (support dotted paths and arrays)
    const dependsValue = React.useMemo(() => {
        if (!src?.dependsOn) return undefined;
        if (Array.isArray(src.dependsOn)) {
            return src.dependsOn.map((d) => getValueByPath(formValues, d));
        }
        return getValueByPath(formValues, src.dependsOn);
    }, [src?.dependsOn, JSON.stringify(formValues)]);

    const buildArgs = React.useCallback(() => {
        if (!src) return [];
        if (Array.isArray(src.params) && src.params.length) {
            return src.params.map((p) => {
                if (p === "query") return query ?? "";
                return getValueByPath(formValues, p);
            });
        }
        // default: [dependsValue?, query?]
        if (Array.isArray(dependsValue)) return [...dependsValue, ...(query ? [query] : [])];
        return dependsValue !== undefined ? [dependsValue, ...(query ? [query] : [])] : (query ? [query] : []);
    }, [src, dependsValue, query, JSON.stringify(formValues)]);

    const reload = React.useCallback(async () => {
        if (!enabled || !src?.function) return;
        setLoading(true);
        setError(null);
        try {
            const args = buildArgs();
            const res = await callFormFunction(src.function, args, { formValues, fieldMeta: field });
            setOptions(Array.isArray(res) ? res : []);
        } catch (e) {
            setError(e);
            setOptions([]);
            console.error("useFieldOptions error", e);
        } finally {
            setLoading(false);
        }
    }, [src?.function, buildArgs, enabled, JSON.stringify(formValues)]);

    // load initially & when deps/query change
    React.useEffect(() => {
        if (!src) return;
        reload();
    }, [src?.function, JSON.stringify(dependsValue), query]);

    return { options, loading, error, reload };
}

// helper to resolve dotted paths like 'a.b.c'
function getValueByPath(obj: any, path?: string) {
    if (!path) return undefined;
    if (!path.includes(".")) return obj?.[path];
    return path.split(".").reduce((acc: any, p) => (acc == null ? undefined : acc[p]), obj);
}
