import { FieldOption } from "@/app/_components/form-renderer";

export const getPopulationGroups = (): FieldOption[] => [
    { value: 'grp123', label: 'Medical Research Group' },
    { value: 'grp456', label: 'Clinical Trial Group' },
    { value: 'grp789', label: 'Survey Research Group' }
];

export const getPopulationSubgroups = (groupId: string): FieldOption[] => {
    const subgroups: { [key: string]: FieldOption[] } = {
        'grp123': [
            { value: 'sub123', label: 'Adult Patients' },
            { value: 'sub456', label: 'Pediatric Patients' },
            { value: 'sub789', label: 'Elderly Patients' }
        ],
        'grp456': [
            { value: 'sub123b', label: 'Phase I Participants' },
            { value: 'sub456b', label: 'Phase II Participants' },
            { value: 'sub789b', label: 'Phase III Participants' }
        ],
        'grp789': [
            { value: 'sub123c', label: 'Healthcare Workers' },
            { value: 'sub456c', label: 'General Public' },
            { value: 'sub789c', label: 'Specialized Groups' }
        ]
    };
    return subgroups[groupId] ?? [];
};

export const getPopulations = (subgroupId: string): FieldOption[] => {
    const populations: { [key: string]: FieldOption[] } = {
        'sub123': [
            { value: 'pop123', label: 'Adults 18-65 with Diabetes' },
            { value: 'pop456', label: 'Adults 18-65 with Hypertension' }
        ],
        'sub456': [
            { value: 'pop789', label: 'Children 6-12 with Asthma' },
            { value: 'pop101', label: 'Children 13-17 with ADHD' }
        ],
        'sub789': [
            { value: 'pop102', label: 'Adults 65+ with Cardiovascular Disease' },
            { value: 'pop103', label: 'Adults 65+ with Dementia' }
        ]
    };
    return populations[subgroupId] ?? [];
};
