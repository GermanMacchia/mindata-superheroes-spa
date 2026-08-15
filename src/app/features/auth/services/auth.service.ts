import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

const EMAIL_STORAGE_KEY = 'auth_email';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly email = signal(localStorage.getItem(EMAIL_STORAGE_KEY) ?? '');
    private readonly router = inject(Router);
    readonly isAuthenticated = computed(() => this.email().length > 0);
    readonly userEmail = this.email.asReadonly();

    login(email: string, _password: string): void {
        localStorage.setItem(EMAIL_STORAGE_KEY, email);
        this.email.set(email);
        this.router.navigateByUrl('/heroes');
    }

    logout(): void {
        localStorage.removeItem(EMAIL_STORAGE_KEY);
        this.email.set('');
        this.router.navigateByUrl('/login');
    }
}
