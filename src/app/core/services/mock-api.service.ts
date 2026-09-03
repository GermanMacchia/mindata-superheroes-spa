import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { withLoadingInterceptor } from '../interceptors/loading.interceptor';
import { PagedResult } from '../models/paged-result.model';
import { LoadingService } from './loading.service';

const SIMULATED_LATENCY_MS = 300;

@Injectable({
    providedIn: 'root',
})
export class MockApiService {
    private readonly _loadingService = inject(LoadingService);
    private readonly _collections = new Map<string, unknown[]>();

    seed<T>(resource: string, data: readonly T[]): void {
        this._collections.set(resource, [...data]);
    }

    create<T>(resource: string, item: T): Observable<T> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];
        all.push(item);
        this._collections.set(resource, all);

        return of(item).pipe(
            delay(SIMULATED_LATENCY_MS),
            withLoadingInterceptor(this._loadingService),
        );
    }

    update<T extends { id: string }>(
        resource: string,
        id: string,
        patch: Partial<T>,
    ): Observable<T> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];
        const index = all.findIndex((item) => item.id === id);

        if (index === -1) {
            return throwError(() => new Error(`No se encontró "${resource}" con id "${id}"`)).pipe(
                withLoadingInterceptor(this._loadingService),
            );
        }

        const updated = { ...all[index], ...patch } as T;
        all[index] = updated;
        this._collections.set(resource, all);

        return of(updated).pipe(
            delay(SIMULATED_LATENCY_MS),
            withLoadingInterceptor(this._loadingService),
        );
    }

    delete<T extends { id: string }>(resource: string, id: string): Observable<void> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];
        this._collections.set(
            resource,
            all.filter((item) => item.id !== id),
        );

        return of(undefined).pipe(
            delay(SIMULATED_LATENCY_MS),
            withLoadingInterceptor(this._loadingService),
        );
    }

    getById<T extends { id: string }>(resource: string, id: string): Observable<T | undefined> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];

        return of(all.find((item) => item.id === id)).pipe(
            delay(SIMULATED_LATENCY_MS),
            withLoadingInterceptor(this._loadingService),
        );
    }

    exists<T>(resource: string, predicate: (item: T) => boolean): Observable<boolean> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];

        return of(all.some(predicate)).pipe(
            delay(SIMULATED_LATENCY_MS),
            withLoadingInterceptor(this._loadingService),
        );
    }

    paginate<T>(
        resource: string,
        offset: number,
        limit: number,
        filter?: (item: T) => boolean,
    ): Observable<PagedResult<T>> {
        const all = (this._collections.get(resource) as T[] | undefined) ?? [];
        const data = filter ? all.filter(filter) : all;

        return of({
            items: data.slice(offset, offset + limit),
            total: data.length,
            offset,
            limit,
        }).pipe(delay(SIMULATED_LATENCY_MS), withLoadingInterceptor(this._loadingService));
    }
}
