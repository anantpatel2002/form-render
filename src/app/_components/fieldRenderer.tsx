import { useFieldOptions } from "@/hooks/useFieldOptions";
import { Field } from "./form-renderer";

type Props = {
  field: Field;
  formValues: Record<string, any>;
  setFieldValue: (name: string, value: any) => void;
  // if using RHF/Formik pass their setValue/getValues wrappers instead
};

export function FieldRenderer({ field, formValues, setFieldValue }: Props) {
  // call hook at top-level (always)
  const { options, loading, error, reload } = useFieldOptions({
    field,
    formValues,
    enabled: !!field.optionsSource || !!field.options,
  });

  // convenience getters
  const value = formValues[field.name];

}