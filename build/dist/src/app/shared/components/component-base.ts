import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';
import { DESKTOP_RESOLUTION, MOBILE_RESOLUTION } from '../services/screen-resolution.service';

@Component({
    template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ComponentBase implements OnInit, OnDestroy {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    alive = false;
    destroyed$ = new Subject<boolean>();

    isMobile = () => {
        return window.innerWidth <= MOBILE_RESOLUTION;
    };

    isTablet = () => {
        return window.innerWidth > MOBILE_RESOLUTION && window.innerWidth <= DESKTOP_RESOLUTION;
    };

    isDesktop = () => {};

    ngOnInit() {
        this.alive = true;
    }

    ngOnDestroy(): void {
        this.alive = false;
        if (this.destroyed$) {
            this.destroyed$.next(true);
            this.destroyed$.complete();
        }
    }
}
