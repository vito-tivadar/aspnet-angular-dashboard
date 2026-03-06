import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CsrfService } from './csrf.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfToken = inject(CsrfService).getToken();

  if (req.url.startsWith(environment.apiUrl)) {
    const cloned = req.clone({ withCredentials: true });
    return next(cloned);
  }

  return next(req);
};
