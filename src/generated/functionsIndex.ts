/* AUTO-GENERATED - DO NOT EDIT */
import type { FormFunction } from '@/types/formFunctions';
import * as m0 from "@/lib/formFunctions/populations";
import * as m1 from "@/lib/formFunctions/catalog";
import * as m2 from "@/data/form-functions/location-functions";

export const functionsMap: Record<string, FormFunction> = {
	"getPopulationGroups": m0.getPopulationGroups,
	"getPopulationSubgroups": m0.getPopulationSubgroups,
	"getPopulations": m0.getPopulations,
	"getDepartments": m1.getDepartments,
	"getCategories": m1.getCategories,
	"getCountries": m2.getCountries,
	"getStatesByCountry": m2.getStatesByCountry,
};
