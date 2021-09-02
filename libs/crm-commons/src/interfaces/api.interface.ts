import { EErrorType } from '../enums';

export interface ErrorResponse {
  id?: string;
  code: string;
  title?: string;
  description: string;
  errorType: EErrorType;
}
