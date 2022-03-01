import { Injectable } from '@angular/core';

export const SMALL_RESOLUTION = 576;
export const MOBILE_RESOLUTION = 768;
export const TABLET_RESOLUTION = 1280;
export const DESKTOP_RESOLUTION = 1600;

@Injectable({
    providedIn: 'root',
})
export class ScreenResolutionService {
    isSmallScreen = () => window.innerWidth <= SMALL_RESOLUTION;
    isMobileResolution = () => window.innerWidth < MOBILE_RESOLUTION;
    isTabletResolution = () => window.innerWidth >= MOBILE_RESOLUTION && window.innerWidth <= TABLET_RESOLUTION;
    isDesktopResolution = () => window.innerWidth > TABLET_RESOLUTION;

    height = () => window.innerHeight;
}
