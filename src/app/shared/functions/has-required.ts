export function hasRequired(required: string[], having: string[]) {
    if (!required.length) {
        return true;
    }

    const intersection = required.filter((value) => (having || []).includes(value));

    return !!intersection.length;
}
