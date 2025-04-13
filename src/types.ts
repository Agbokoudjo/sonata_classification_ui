import { OptionsInputField } from "@wlindabla/form_validator";
export type  InputNameClassification={
    placeholder?: string;
    classNameField?: string;
    htmlInputOptions?: Record<string, unknown>
    classNameRowContainer?: string[];
    classNameTextFieldContainer?: string[];
    classNameLabelTextField?: string[];
    labelTextField?: string;
    optionsValidatorField?: OptionsInputField;
} 
export type CheckboxClassification = {
    classNameCheckbox?: string[];
    classNameLabel?: string[];
    classNameContainer?: string[];
    labelCheckbox?: string;
    htmlInputOptionsCheckbox?: Record<string, unknown>
}
export type ErrorState = { [key: string]: boolean | undefined };
export type ErrorMessageState = { [key: string]: string[] | null | undefined };
export type OptionsCollectionItemClassification = {
    classNameClassificationItem?: string[];
    classNameClassificationContainerTitle?:string[]
    classNameContainerDelete?: string[];
    classNameButtonDelete?: string[];
    labelButtonDelete?: string;
    classNameIconDelete?: string[];
    nameFieldOptions?: InputNameClassification;
    optionsCheckbox?: CheckboxClassification;
    classNameContainerAdd?: string[];
    classNameButtonAdd?: string[];
    labelButtonAdd?: string;
    classNameIconAdd?: string[];
}