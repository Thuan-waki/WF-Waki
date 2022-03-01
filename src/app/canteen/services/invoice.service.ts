import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(private httpClient: HttpClient) {}

    getInvoice = (invoiceNumber: string): Observable<Blob> => {
        const authKey = localStorage.getItem('jwt_token');
        const httpOptions = {
            responseType: 'blob' as 'json',
            Headers: new HttpHeaders({
                Authorization: authKey || ''
            })
        };

        const url = `api/v2/invoices/${invoiceNumber}`;
        return this.httpClient.get<Blob>(url, httpOptions);
    };

    email = (invoiceNumber: string): Observable<IApiResult> => {
        const url = `api/v2/invoices/email/${invoiceNumber}`;
        return this.httpClient.post<IApiResult>(url, null);
    };
}
