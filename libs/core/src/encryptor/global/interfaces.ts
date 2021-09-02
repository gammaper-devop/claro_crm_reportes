export interface IEncryptor {
  encrypt(value: any): string;
  unEncrypt(value: string): any;
}

export type TypeEncryptor = 'browser' | 'traffic';
