import { environment } from 'src/environments/environment';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

export function getServerUrl() {
    return environment.apiUrl;
}

export function getImageServerUrl() {
    return environment.imageUrl;
}
