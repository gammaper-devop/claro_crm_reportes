export interface MaterialResponse {
  code: string;
  description: string;
  materialType: string;
  serie: string;
}

export class Material {
  code: string;
  description: string;
  materialType: string;
  serie: string;

  constructor(material: MaterialResponse) {
    this.code = material.code ? material.code : '';
    this.description = material.description ? material.description : '';
    this.materialType = material.materialType ? material.materialType : '';
    this.serie = material.serie ? material.serie : '';
  }
}
