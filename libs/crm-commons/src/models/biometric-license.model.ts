export interface Lincese{
  registerId: string;
  userEmail?: string;
  customerId?: string;
}

export class BiometricLincese {
    registerId: string;
    userEmail: string;
    customerId: string;
   

    constructor(biometricLicense: Lincese) {
        this.registerId = biometricLicense.registerId;
        this.userEmail = biometricLicense.userEmail;
        this.customerId = biometricLicense.customerId;
    }
}
