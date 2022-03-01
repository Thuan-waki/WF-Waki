export interface MenuItem {
    order: number;
    link: string;
    label: string;
    type: 'ITEM' | 'LINK';
    requiredClaims?: string[];
    sub?: MenuItem[];
}
