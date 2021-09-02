import { IParameter } from './parameter.interface';

export interface MultipointResponse {
  flagMultipoint: string;
  listMultipoint: {
    codigo: string;
    descripcion: string;
  }[];
}

export class Multipoint {
  flagMultipoint: string;
  listMultipoint: IParameter[];

  constructor(multipointResponse: MultipointResponse) {
    this.flagMultipoint = multipointResponse.flagMultipoint || '';
    if (multipointResponse.listMultipoint) {
      this.listMultipoint = multipointResponse.listMultipoint.map(
        multipoint =>
          ({
            value: multipoint.codigo,
            label: multipoint.descripcion,
          } as IParameter),
      );
    }
  }
}
