import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

const EMAIL_STORAGE_KEY = 'auth_email';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly _email = signal(localStorage.getItem(EMAIL_STORAGE_KEY) ?? '');
    private readonly _router = inject(Router);
    readonly isAuthenticated = computed(() => this._email().length > 0);
    readonly userEmail = this._email.asReadonly();

    login(email: string, _password: string): void {
        localStorage.setItem(EMAIL_STORAGE_KEY, email);
        this._email.set(email);
        this._router.navigateByUrl('/heroes');
    }

    logout(): void {
        localStorage.removeItem(EMAIL_STORAGE_KEY);
        this._email.set('');
        this._router.navigateByUrl('/login');
    }
}
