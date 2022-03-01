import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getBaseUrl } from '@portal/shared/functions/get-base-url';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const providers = [{ provide: APP_BASE_HREF, useFactory: getBaseUrl, deps: [] }];

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic(providers)
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
