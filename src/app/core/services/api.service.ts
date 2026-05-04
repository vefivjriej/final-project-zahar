import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(this.url(path), { params: this.toParams(params) });
  }

  post<TBody extends object, TResponse>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.url(path), body);
  }

  put<TBody extends object, TResponse>(path: string, body: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(this.url(path), body);
  }

  patch<TBody extends object, TResponse>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.url(path), body);
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.url(path));
  }

  private url(path: string): string {
    return `${this.apiUrl}${path}`;
  }

  private toParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
}
