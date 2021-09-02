export interface PaymentPortaResponse {
  phones: {
    phone: string;
    date: string;
   
  }[];
}

export class PaymentPorta {
  
  phones: {
    phone: string;
    date: string;
   
  }[];
  

  constructor(paymentPortaResponse: PaymentPortaResponse) {
   
    if (paymentPortaResponse.phones) {
      this.phones = paymentPortaResponse.phones.map(
        phones => ({
          date: phones.date || '',
          phone: phones.phone|| '',
          
        }),
      );
    }
  }
}
