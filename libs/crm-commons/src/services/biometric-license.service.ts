import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {
    BiometricLincese,
    Lincese,
} from '../models';
import { CRMApiService } from './api.service';
@Injectable({
    providedIn: 'root',
})
export class CRMBiometricLicenseService {
    constructor(private apiService: CRMApiService,
        ) {
    }

    async getLinceseBiometric(
        body: any,
        config: {
            api: string;
            mock: boolean;
        },
    ): Promise<boolean> {
        try {
            const responseRegisterId = await this.apiService
                .post(this.apiService.getLinceseBiometric, body)
                .pipe(map((response: Lincese) => new BiometricLincese(response)))
                .toPromise();

            const params = "r=" + Math.random() + "&op=activateLicense&registerID=" + responseRegisterId.registerId;

            const responseActivedLicense = await fetch(`${config.api}?${params}`, {
                method: 'GET',
                headers: {'Content-Type': 'text/plain; charset=utf-8'},
            });
            if (!responseActivedLicense.ok) {
                return Promise.reject();
            }
            const responseText = await responseActivedLicense.text();
            if (!responseText) {
                return Promise.reject();
            }
            if (responseText !== '19000') {
                return Promise.reject(responseText);
            }
            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
