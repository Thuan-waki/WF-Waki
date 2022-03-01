import { AppComponent } from "@portal/app.component";

export function getPaginationTxt(txt: string) {
    if (AppComponent.textDir === 'rtl') {
        const txtArr = txt.split(' ');
        const newStr = txtArr.map((char: any) => {
            switch (char) {
                case 'Page':
                    return 'الصفحة';
                case 'of':
                    return 'من';
                case 'from':
                    return 'تتضمن';
                case 'record': case 'records':
                    return 'سجلات';
                default:
                    return char;
            }
        })

        return newStr.join(' ');
    }
    return txt;
}