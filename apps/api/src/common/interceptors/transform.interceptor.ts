/**
 * Transform Interceptor
 * Wraps successful responses in standard format
 * @module common/interceptors/transform
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { nanoid } from 'nanoid';

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || nanoid();

    // Add requestId to response headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-Request-ID', requestId);

    return next.handle().pipe(
      map((data) => {
        // If response is already formatted, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Extract message if data contains it
        let message: string | undefined;
        let responseData = data;

        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          message = data.message as string;
          responseData = data.data;
        }

        return {
          success: true as const,
          data: responseData,
          ...(message && { message }),
          timestamp: new Date().toISOString(),
          requestId,
        };
      }),
    );
  }
}
