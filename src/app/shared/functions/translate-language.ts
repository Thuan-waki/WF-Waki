export function translationLang(value: any) {
    const transObj = Array.isArray(value) ? value[0]?.translations : value;

    if (!transObj) {
        return '';
    }
    
    return sessionStorage.getItem('lang') === 'ar' ? transObj.ar : transObj.en;
}