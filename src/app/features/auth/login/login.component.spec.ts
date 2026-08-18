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

    it('should log in with any credentials and navigate to /heroes', () => {
        const loginSpy = vi.spyOn(authService, 'login');
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');
        component.form.setValue({ email: 'a@a.com', password: 'anything' });

        component.submit();

        expect(loginSpy).toHaveBeenCalledWith('a@a.com', 'anything');
        expect(navigateSpy).toHaveBeenCalledWith('/heroes');
    });
});
