import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from '@app/features/auth/services/auth.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    let authService: AuthService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display the logged-in user email', () => {
        authService.login('test@mail.com', 'anything');
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('test@mail.com');
    });

    it('should call logout on click', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        fixture.componentInstance.logout();

        expect(authService.isAuthenticated()).toBe(false);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should call logout when clicking the logout button', () => {
        authService.login('test@mail.com', 'anything');
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();

        const logoutButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        logoutButton.click();

        expect(authService.isAuthenticated()).toBe(false);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
});
