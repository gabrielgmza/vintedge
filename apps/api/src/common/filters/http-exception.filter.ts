/**
 * HTTP Exception Filter
 * Standardizes error responses across the API
 * @module common/filters/http-exception
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field?: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || nanoid();
    const timestamp = new Date().toISOString();
    const path = request.url;

    let status: number;
    let errorCode: string;
    let message: string;
    let details: Record<string, unknown> | undefined;
    let field: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) || exception.message;
        errorCode = (res.code as string) || this.getErrorCodeFromStatus(status);
        details = res.details as Record<string, unknown>;
        field = res.field as string;

        // Handle validation errors from class-validator
        if (Array.isArray(res.message)) {
          message = res.message[0] || 'Validation failed';
          details = { validationErrors: res.message };
          errorCode = 'VALIDATION_ERROR';
        }
      } else {
        message = exception.message;
        errorCode = this.getErrorCodeFromStatus(status);
      }
    } else if (exception instanceof Error) {
      // Unexpected errors - log full details but return generic message
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_ERROR';
      message = 'An unexpected error occurred';

      // Log the actual error for debugging
      this.logger.error(
        {
          requestId,
          path,
          error: exception.message,
          stack: exception.stack,
        },
        'Unhandled exception',
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_ERROR';
      message = 'An unexpected error occurred';

      this.logger.error({ requestId, path, error: exception }, 'Unknown exception type');
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
        ...(field && { field }),
      },
      timestamp,
      requestId,
      path,
    };

    // Log non-500 errors at info level, 500s at error level
    if (status >= 500) {
      this.logger.error({ ...errorResponse, status }, 'Server error');
    } else if (status >= 400) {
      this.logger.warn({ ...errorResponse, status }, 'Client error');
    }

    response.status(status).json(errorResponse);
  }

  private getErrorCodeFromStatus(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'AUTHENTICATION_ERROR',
      403: 'AUTHORIZATION_ERROR',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };

    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}
