export interface DepartmentResponse {
  departamentCode: string;
  departamentDescription: string;
}

export class Department {
  value: string;
  label: string;
  constructor(department: DepartmentResponse) {
    this.value = department.departamentCode ? department.departamentCode : '';
    this.label = department.departamentDescription
      ? department.departamentDescription
      : '';
  }
}

export interface ProvinceResponse {
  provinceCode: string;
  provinceDescription: string;
}

export class Province {
  value: string;
  label: string;
  constructor(province: ProvinceResponse) {
    this.value = province.provinceCode ? province.provinceCode : '';
    this.label = province.provinceDescription
      ? province.provinceDescription
      : '';
  }
}

export interface DistrictResponse {
  districCode: string;
  districtDescription: string;
}

export class District {
  value: string;
  label: string;
  constructor(district: DistrictResponse) {
    this.value = district.districCode ? district.districCode : '';
    this.label = district.districtDescription
      ? district.districtDescription
      : '';
  }
}

export interface UbigeoResponse {
  ubigeoCode: string;
  description: string;
  provinceCode: string;
  provincieDescription: string;
  districtCode: string;
  districtDescription: string;
}

export class Ubigeo {
  value: string;
  label: string;
  provinceCode: string;
  provinceDescription: string;
  districtCode: string;
  districtDescription: string;
  constructor(ubigeo: UbigeoResponse) {
    this.value = ubigeo.ubigeoCode ? ubigeo.ubigeoCode : '';
    this.label = ubigeo.description ? ubigeo.description : '';
    this.provinceCode = ubigeo.provinceCode ? ubigeo.provinceCode : '';
    this.provinceDescription = ubigeo.provincieDescription
      ? ubigeo.provincieDescription
      : '';
    this.districtCode = ubigeo.districtCode ? ubigeo.districtCode : '';
    this.districtDescription = ubigeo.districtDescription
      ? ubigeo.districtDescription
      : '';
  }
}

export interface PopulatedCenterResponse {
  coverageIndicator: string;
  populatedCenter: string;
}

export class PopulatedCenter {
  value: string;
  label: string;
  constructor(populatedCenter: PopulatedCenterResponse) {
    this.value = populatedCenter.coverageIndicator
      ? populatedCenter.coverageIndicator
      : '';
    this.label = populatedCenter.populatedCenter
      ? populatedCenter.populatedCenter
      : '';
  }
}

