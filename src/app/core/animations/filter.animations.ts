import { animate, query, style, transition, trigger, stagger, sequence } from '@angular/animations';

export const filterAnimations = trigger('filterAnimations', [
    transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: 300, opacity: 1 }))
    ]),
    transition(':leave', [style({ height: 300, opacity: 1 }), animate('1s ease-in', style({ height: 0, opacity: 0 }))])
]);
