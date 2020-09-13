import { FormArray } from '@angular/forms';
import { HaloTooltipPosition } from '@halodigital/tooltip';
import { HaloInputDirection, HaloInputType } from '../input';


export interface HaloInputFormListField {
    id: string;
    type: HaloInputType;
    noValidate?: boolean;
    placeholder?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    range?: boolean;
    multiple?: boolean;
    direction?: HaloInputDirection;
    initLabels?: string[][];
    options?: any[];
    optionsEndpoint?: string;
    optionsEndpointParam?: string;
    optionsCaching?: boolean;
    optionsExcludeValues?: any[];
    optionsPerGroup?: any[][];
    forceValueInOptions?: boolean;
    uploadEndpoint?: string;
    min?: number;
    max?: number;
    pattern?: string;
    groupName?: string;
    tooltipPosition?: HaloTooltipPosition;
    hideFromFirstGroup?: boolean;
    typePerGroup?: HaloInputType[];
    onChange?: (fieldValue: any, fieldId: string, fieldIndex: number, form: FormArray, entireListValue: object[]) => void;
}

export enum HaloInputFormListMode {
    All = 'all',
    None = 'none',
    Partial = 'partial'
}
