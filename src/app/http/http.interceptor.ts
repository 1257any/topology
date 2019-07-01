import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NoticeService } from 'le5le-components/notice';
import { CookieService, StoreService } from 'le5le-store';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core/core.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(protected store: StoreService, protected coreService: CoreService) {}

  private getToken(): string {
    const remember: any = localStorage.getItem('rememberMe');
    if (remember) {
      return localStorage.getItem(environment.token) || '';
    } else {
      return CookieService.get(environment.token) || '';
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', this.getToken())
    });
    return next.handle(authReq).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => {
          if (event instanceof HttpResponse) {
            // Update token.
            if (event.headers.get(environment.token)) {
              this.coreService.saveToken({ token: event.headers.get(environment.token) });
            }

            // Pop error.
            if (event.body.error) {
              const _noticeService: NoticeService = new NoticeService();
              _noticeService.notice({
                body: event.body.error,
                theme: 'error',
                timeout: 10000
              });
              // tslint:disable-next-line:triple-equals
            } else if (event.body.code && event.body.code != 0) {
              event.body.error = event.body.message;
              const _noticeService: NoticeService = new NoticeService();
              _noticeService.notice({
                body: event.body.message,
                theme: 'error',
                timeout: 10000
              });
            }

            if (event.status === 401) {
              this.store.set('auth', -1);
            } else if (event.status === 403) {
              this.store.set('redirect', '/');
            }
          }
        },
        // Operation failed; error is an HttpErrorResponse
        error => {
          if (error.status === 401) {
            this.store.set('auth', -1);
          } else if (error.status === 403) {
            this.store.set('redirect', '/');
          } else if (error.status === 504) {
            const _noticeService: NoticeService = new NoticeService();
            _noticeService.notice({
              body: '网络超时，请检测你的网络',
              theme: 'error'
            });
          } else {
            const _noticeService: NoticeService = new NoticeService();
            _noticeService.notice({
              body: '未知网络错误，请检测你的网络',
              theme: 'error'
            });
          }
        }
      )
    );
  }
}
