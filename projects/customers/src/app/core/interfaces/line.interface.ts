import { IParameter } from '../models';

export interface ILine {
  order: number;
  service: IParameter;
  operator: IParameter;
  modality: IParameter;
  phone: string;
  saleOptions: IParameter[];
}
