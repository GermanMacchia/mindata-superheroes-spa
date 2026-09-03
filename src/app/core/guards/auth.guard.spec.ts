import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, provideRouter } from '@angular/router';

import { AuthService } from '@app/features/auth/services/auth.service';

import { appGuard, authGuard } from './auth.guard';

describe('authGuard', () => {
    const executeAuthGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));
    const executeAppGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => appGuard(...guardParameters));

    let authService: AuthService;
    let router: Router;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({ providers: [provideRouter([])] });

        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    });

    it('should be created', () => {
        expect(executeAuthGuard).toBeTruthy();
    });

    it('should allow access when the user is authenticated', () => {
        authService.login('test@mail.com', 'anything');

        const result = executeAuthGuard({} as never, {} as never);

        expect(result).toBe(true);
    });

    it('should redirect to /login when the user is not authenticated', () => {
        const result = executeAuthGuard({} as never, {} as never);

        expect(result).toEqual(router.createUrlTree(['/login']));
    });

    it('should redirect an authenticated user away from the public pages', () => {
        authService.login('test@mail.com', 'anything');

        const result = executeAppGuard({} as never, {} as never);

        expect(result).toEqual(router.createUrlTree(['/heroes']));
    });

    it('should allow access to the public pages when the user is not authenticated', () => {
        const result = executeAppGuard({} as never, {} as never);

        expect(result).toBe(true);
    });
});
