import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INTERCEPTOR_SKIP_HEADER } from '@portal/shared/constants/common.constants';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ICardStoreFilter } from '../models/card-store.model';

@Injectable({
    providedIn: 'root'
})
export class CardStoreService {
    constructor(private httpClient: HttpClient) { }

    getAllCardStore = (filter?: ICardStoreFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/store-items?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.type && filter.type.length) {
            url = url.concat(`&type=${filter.type}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getStoreItem = (id: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/store-items/${id}`);
    }

    postStoreItem = (cardItem: any, file?: string): Observable<HttpEvent<IApiResult>> => {
        const formData = new FormData();

        if (file && file.length) {
            formData.append('image', this.b64toBlob(file), 'cardItem.png');
        }
        formData.append('data', JSON.stringify(cardItem));

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.post<IApiResult>(`api/v2/store-items`, formData, {
            headers: headers.append(INTERCEPTOR_SKIP_HEADER, ''),
            reportProgress: true,
            observe: 'events'
        });
    };

    patchStoreItem = (id: string, storeItem: any): Observable<HttpEvent<IApiResult>> => {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.patch<IApiResult>(`api/v2/store-items/${id}`, storeItem, {
            headers: headers.append(INTERCEPTOR_SKIP_HEADER, ''),
            reportProgress: true,
            observe: 'events'
        });
    };

    patchImageStoreItem = (id: string, file: string): Observable<HttpEvent<IApiResult>> => {
        const formData = new FormData();
        formData.append('image', this.b64toBlob(file), 'cardItem.png');

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.patch<IApiResult>(`api/v2/store-items/${id}`, formData, {
            headers: headers.append(INTERCEPTOR_SKIP_HEADER, ''),
            reportProgress: true,
            observe: 'events'
        });
    }

    b64toBlob = (b64Data: string, contentType = 'image/png', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
}
