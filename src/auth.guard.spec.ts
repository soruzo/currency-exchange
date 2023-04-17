import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    authGuard = new AuthGuard();
  });

  it('should allow access with correct token', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${process.env.SECRET_TOKEN}`,
          },
        }),
      }),
    });

    expect(authGuard.canActivate(context)).toBe(true);
  });

  it('should deny access with incorrect token', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer incorrect-token',
          },
        }),
      }),
    });

    expect(authGuard.canActivate(context)).toBe(false);
  });

  it('should deny access with missing token', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    expect(authGuard.canActivate(context)).toBe(false);
  });
});
