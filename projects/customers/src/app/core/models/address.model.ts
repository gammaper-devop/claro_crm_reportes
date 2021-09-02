export interface AddressIdentifierResponse {
  code: string;
  description: string;
  abbreviation: string;
}

export class AddressIdentifier {
  value: string;
  label: string;
  abbreviation: string;
  constructor(addressIdentifier: AddressIdentifierResponse) {
    this.value = addressIdentifier.code ? addressIdentifier.code : '';
    this.label = addressIdentifier.description
      ? addressIdentifier.description
      : '';
    this.abbreviation = addressIdentifier.abbreviation
      ? addressIdentifier.abbreviation
      : '';
  }
}
