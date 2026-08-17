import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { withLoadingInterceptor } from '../interceptors/loading.interceptor';
import { PagedResult } from '../models/paged-result.model';
import { LoadingService } from './loading.service';

const SIMULATED_LATENCY_MS = 300;

@Injectable({
    providedIn: 'root',
})
export class MockApiService {
    private readonly loadingService = inject(LoadingService);
    private readonly collections = new Map<string, unknown[]>();

    seed<T>(resource: string, data: readonly T[]): void {
        this.collections.set(resource, [...data]);
    }

    create<T>(resource: string, item: T): Observable<T> {
        const all = (this.collections.get(resource) as T[] | undefined) ?? [];
        all.push(item);
        this.collections.set(resource, all);

        return of(item).pipe(delay(SIMULATED_LATENCY_MS), withLoadingInterceptor(this.loadingService));
    }

    paginate<T>(
        resource: string,
        offset: number,
        limit: number,
        filter?: (item: T) => boolean,
    ): Observable<PagedResult<T>> {
        const all = (this.collections.get(resource) as T[] | undefined) ?? [];
        const data = filter ? all.filter(filter) : all;

        return of({
            items: data.slice(offset, offset + limit),
            total: data.length,
            offset,
            limit,
        }).pipe(delay(SIMULATED_LATENCY_MS), withLoadingInterceptor(this.loadingService));
    }
}
