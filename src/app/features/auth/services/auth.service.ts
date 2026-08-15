import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

const STORAGE_KEY = 'auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly authenticated = signal(localStorage.getItem(STORAGE_KEY) === '1');
    private readonly router = inject(Router);
    readonly isAuthenticated = this.authenticated.asReadonly();

    login(_email: string, _password: string): void {
        localStorage.setItem(STORAGE_KEY, '1');
        this.authenticated.set(true);
        this.router.navigateByUrl('/heroes');
    }

    logout(): void {
        localStorage.removeItem(STORAGE_KEY);
        this.authenticated.set(false);
    }
}
