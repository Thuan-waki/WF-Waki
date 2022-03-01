
import { translationLang } from "./translate-language";
import { ISelectOption } from "../models/select-option.model";

export const selectOptions = (array: any[]): ISelectOption[] => {
    if (!array || !array.length) {
        return [];
    }
    return array.map((item) => ({ value: item._id, label: translationLang(item.translations) }));
};