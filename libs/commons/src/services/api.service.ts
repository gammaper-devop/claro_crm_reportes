import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ClaroApiService {
  constructor(private http: HttpClient) {}

  public formatErrors(error: HttpErrorResponse) {
    const messageError = error.error ? error.error : error;
    return throwError(messageError);
  }

  get(path: string, params?: any): Observable<any> {
    return this.http.get(path, { params }).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  put(path: string, body = {}): Observable<any> {
    return this.http.put(path, JSON.stringify(body)).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  patch(path: string, body = {}): Observable<any> {
    return this.http.patch(path, JSON.stringify(body)).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  post(path: string, body = {}): Observable<any> {
    return this.http.post(path, JSON.stringify(body)).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  delete(path: string): Observable<any> {
    return this.http.delete(path).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  jsonp(path: string, callback = 'callback'): Observable<any> {
    return this.http.jsonp(path, callback).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }
}
