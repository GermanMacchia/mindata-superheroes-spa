import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PagedResult } from '../models/paged-result.model';

@Injectable({
    providedIn: 'root',
})
export class MockApiService {
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
        });
    }
}
