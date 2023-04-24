import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaymentSetupIntentResponse } from './payment';

const API_BASE_URL = 'https://localhost:7886/api';

@Injectable({
  providedIn: 'root',
})
export class PaymentApiService {
  constructor(private http: HttpClient) {}

  public createSetupIntent(
    userId: string,
    planId: string
  ): Observable<IPaymentSetupIntentResponse> {
    const url = `${API_BASE_URL}/payment-setup`;
    return this.http.post<IPaymentSetupIntentResponse>(url, {
      userId: 'test1',
      planId: 'test',
      userFirstName: 'test',
      userLastName: 'test',
      userEmail: 'test',
      userTaxId: 'RO1234567891'
    });
  }
}
