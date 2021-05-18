import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { TokenStorage } from "./token-storage.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorage) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.tokenStorage.getToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenStorage.getToken()}`,
        },
      });
    }
    return next.handle(request);
  }
}
