import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly _loading = signal(false);

    readonly isLoading = this._loading.asReadonly();

    start(): void {
        this._loading.set(true);
    }

    stop(): void {
        this._loading.set(false);
    }
}
