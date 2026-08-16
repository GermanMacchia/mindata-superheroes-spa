import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '@app/core/models/paged-result.model';
import { MockApiService } from '@app/core/services/mock-api.service';

import { HEROES_SEED } from '../data/heroes.seed';
import { SuperHero } from '../models/super-hero.model';

const RESOURCE = 'heroes';

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    private readonly mockApi = inject(MockApiService);

    constructor() {
        this.mockApi.seed(RESOURCE, HEROES_SEED);
    }

    getHeroes(offset: number, limit: number): Observable<PagedResult<SuperHero>> {
        return this.mockApi.paginate<SuperHero>(RESOURCE, offset, limit);
    }
}
