import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as humps from 'humps';

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        request.body = humps.camelizeKeys(request.body);
        return next.handle().pipe(map(data => humps.decamelizeKeys(data)));
    }
}