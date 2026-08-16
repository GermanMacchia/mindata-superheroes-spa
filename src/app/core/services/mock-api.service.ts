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

    paginate<T>(resource: string, offset: number, limit: number): Observable<PagedResult<T>> {
        const data = (this.collections.get(resource) as T[] | undefined) ?? [];

        return of({
            items: data.slice(offset, offset + limit),
            total: data.length,
            offset,
            limit,
        }).pipe(delay(SIMULATED_LATENCY_MS), withLoadingInterceptor(this.loadingService));
    }
}
