import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {

  const baseApiUrl = environment.boardsApiUrl;

  return next(
    req.clone({
      url: `${baseApiUrl}${req.url}`,
    }),
  );
};
