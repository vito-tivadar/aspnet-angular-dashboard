import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private token = '';

    constructor(private http: HttpClient) {}

  fetchToken() {
    return this.http.get<{token: string}>(`${environment.apiUrl}/auth/csrf-token`,
      { withCredentials: true }
    ).pipe(tap(r => this.token = r.token));
  }

  getToken() { return this.token; }
}
