import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '@shell/environments/environment';
import { ISerie } from '../interfaces';
import {
  Campaign,
  CampaignResponse,
  IParameter,
  Plan,
  PlanResponse,
  Price,
  PriceResponse,
  Maxlines,
  MaxlinesResponse,
} from '../models';
import { ApiService } from './api.service';
import { Material, MaterialResponse } from '../models/materials.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  modalities: IParameter[];
  productsTypes: IParameter[];
  saleOptions: any[];
  material: Material[];
  series: Material[];
  newLineOptions: IParameter[];

  constructor(private apiService: ApiService) {}

  init() {
    this.modalities = null;
    this.productsTypes = null;
    this.saleOptions = null;
  }

  getMaxlines(body: any): Promise<Maxlines> {
    return this.apiService
      .post(this.apiService.maxlines, body)
      .pipe(map((maxlines: MaxlinesResponse) => new Maxlines(maxlines)))
      .toPromise();
  }

  getMaterials(body: any): Promise<Material[]> {
    if (this.material) {
      return Promise.resolve(this.material);
    } else {
      return this.apiService
        .post(this.apiService.materialDescriptions, body)
        .pipe(
          map((chipDescriptions: MaterialResponse[]) =>
            chipDescriptions.map(chipDesc => new Material(chipDesc)),
          ),
        )
        .toPromise();
    }
  }

  getSeries(body: any, isRenoRepo = true): Promise<Material[]> {
    if (this.series) {
      return Promise.resolve(this.series);
    } else {
      const endpoint = isRenoRepo
        ? this.apiService.series
        : this.apiService.seriesPorta;
      return this.apiService
        .post(endpoint, body)
        .pipe(
          map((chipDescriptions: MaterialResponse[]) =>
            chipDescriptions.map(chipDesc => new Material(chipDesc)),
          ),
        )
        .toPromise();
    }
  }

  getModalities(): Promise<IParameter[]> {
    if (this.modalities) {
      return Promise.resolve(this.modalities);
    } else {
      return this.apiService
        .get(this.apiService.modalities)
        .pipe(
          map(
            (
              modalities: {
                modalityDestinationCode: string;
                modalityDestinationDescription: string;
              }[],
            ) => {
              this.modalities = modalities.map(
                modality =>
                  ({
                    value: modality.modalityDestinationCode,
                    label: modality.modalityDestinationDescription,
                  } as IParameter),
              );
              return this.modalities;
            },
          ),
        )
        .toPromise();
    }
  }

  getProductsTypes(body: any): Promise<IParameter[]> {
    if (this.productsTypes) {
      return Promise.resolve(this.productsTypes);
    } else {
      return this.apiService
        .post(this.apiService.promotions, body)
        .pipe(
          map(
            (
              productsTypes: {
                promotionCode: string;
                promotionDescription: string;
              }[],
            ) =>
              productsTypes.map(
                modality =>
                  ({
                    value: modality.promotionCode,
                    label: modality.promotionDescription,
                  } as IParameter),
              ),
          ),
          map((response: IParameter[]) => {
            const allowedProductTypes = ['01', '02', '03'];
            this.productsTypes = response.filter(element =>
              allowedProductTypes.includes(element.value),
            );
            return this.productsTypes;
          }),
        )
        .toPromise();
    }
  }

  getOptions(
    secNumber: string,
    phones: string[],
  ): Promise<{ [phone: string]: IParameter[] }> {
    if (this.saleOptions) {
      return Promise.resolve(this.getOptionsFormatted());
    } else {
      const body = { secNumber, phones: phones.join(',') };
      if (!secNumber) {
        delete body.secNumber;
      }
      if (!environment.mock) {
        delete body.phones;
      }
      return this.apiService
        .post(this.apiService.previewConsult, body)
        .pipe(
          map(saleOptions => {
            this.saleOptions = saleOptions;
            return this.getOptionsFormatted();
          }),
        )
        .toPromise();
    }
  }

  private getOptionsFormatted(): { [phone: string]: IParameter[] } {
    const response = {};
    this.saleOptions.forEach(saleOption => {
      response[saleOption.phoneNumber || 0] = saleOption.saleTypeAllowed.map(
        saleType =>
          ({
            value: saleType.optionCode,
            label: saleType.optionDescription,
          } as IParameter),
      );
    });
    return response;
  }

  getNewLineOptions(body: any): Promise<IParameter[]> {
    return this.apiService
      .post(this.apiService.newLineOptions, body)
      .pipe(
        map(
          (
            options: {
              code: string;
              description: string;
            } [],
          ) => {
            this.newLineOptions = options.map(
              option =>
              ({
                value: option.code,
                label: option.description
              } as IParameter),
            );
            return this.newLineOptions;
          },
        ),
      )
      .toPromise();
  }

  validateDisponibility(body: any): Promise<ISerie> {
    return this.apiService
      .post(this.apiService.validateDisponibility, body)
      .pipe(
        map((serie: ISerie) => {
          serie.serie = body.serieNumber;
          return serie;
        }),
      )
      .toPromise();
  }
  validateDisponibilityRepo(body: any): Promise<ISerie> {
    return this.apiService
      .post(this.apiService.validateDisponibilityRepo, body)
      .pipe(
        map((serie: ISerie) => {
          serie.serie = body.serieNumber;
          return serie;
        }),
      )
      .toPromise();
  }

  getCampaigns(body: any): Promise<Campaign[]> {
    return this.apiService
      .post(this.apiService.campaigns, body)
      .pipe(
        map((campaigns: CampaignResponse[]) =>
          campaigns.map(campaign => new Campaign(campaign)),
        ),
      )
      .toPromise();
  }

  getPrices(body: any): Promise<Price[]> {
    return this.apiService
      .post(this.apiService.prices, body)
      .pipe(
        map((prices: PriceResponse[]) => prices.map(price => new Price(price))),
      )
      .toPromise();
  }

  getPlans(body: any): Promise<Plan[]> {
    return this.apiService
      .post(this.apiService.plans, body)
      .pipe(map((plans: PlanResponse[]) => plans.map(plan => new Plan(plan))))
      .toPromise();
  }

  addItem(body: any): Promise<{}> {
    return this.apiService.post(this.apiService.addItem, body).toPromise();
  }

  stockValidation(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.stockValidation, body)
      .toPromise();
  }
}
