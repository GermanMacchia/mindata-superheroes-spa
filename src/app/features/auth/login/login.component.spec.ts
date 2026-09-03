import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let router: Router;
    let authService: AuthService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        authService = TestBed.inject(AuthService);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should treat the button as disabled while both fields are empty', () => {
        expect(component.bothEmpty()).toBe(true);
    });

    it('should stop treating the button as disabled once a field has a value', () => {
        component.form.controls.email.setValue('a@a.com');

        expect(component.bothEmpty()).toBe(false);
    });

    it('should not log in when the form is invalid', () => {
        const loginSpy = vi.spyOn(authService, 'login');

        component.submit();

        expect(loginSpy).not.toHaveBeenCalled();
        expect(component.form.controls.email.touched).toBe(true);
    });

    it('should show validation errors for email and password once touched', () => {
        component.submit();
        fixture.detectChanges();

        const errors = fixture.nativeElement.querySelectorAll('mat-error');

        expect(errors.length).toBe(2);
        expect(errors[0].textContent).toContain('Ingresá un email válido');
        expect(errors[1].textContent).toContain('La contraseña es obligatoria');
    });

    it('should log in with any credentials and navigate to /heroes', () => {
        const loginSpy = vi.spyOn(authService, 'login');
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');
        component.form.setValue({ email: 'a@a.com', password: 'anything' });

        component.submit();

        expect(loginSpy).toHaveBeenCalledWith('a@a.com', 'anything');
        expect(navigateSpy).toHaveBeenCalledWith('/heroes');
    });

    it('should submit via the form ngSubmit binding, not just by calling submit() directly', () => {
        const loginSpy = vi.spyOn(authService, 'login');
        vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
        component.form.setValue({ email: 'a@a.com', password: 'anything' });
        fixture.detectChanges();

        const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
        form.dispatchEvent(new Event('submit'));

        expect(loginSpy).toHaveBeenCalledWith('a@a.com', 'anything');
    });

    it('should prevent navigation when the register link is clicked', () => {
        fixture.detectChanges();

        const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.login__register');
        const event = new MouseEvent('click', { cancelable: true });
        link.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });
});
