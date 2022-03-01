import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './shared/functions/custom-url-serilizer';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AuthModule,
        CoreModule,
        AppRoutingModule,
        ToastrModule.forRoot({
            progressBar: true
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: UrlSerializer, useClass: CustomUrlSerializer },
        { provide: LOCALE_ID,  useValue: 'en-US' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
