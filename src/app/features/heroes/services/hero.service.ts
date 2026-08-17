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

    getHeroes(offset: number, limit: number, search?: string): Observable<PagedResult<SuperHero>> {
        const term = search?.trim().toLowerCase();
        const filter = term ? (hero: SuperHero) => this.matchesSearch(hero, term) : undefined;

        return this.mockApi.paginate<SuperHero>(RESOURCE, offset, limit, filter);
    }

    private matchesSearch(hero: SuperHero, term: string): boolean {
        return (
            hero.id.toLowerCase().includes(term) ||
            hero.name.toLowerCase().includes(term) ||
            !!hero.realName?.toLowerCase().includes(term) ||
            !!hero.universe?.toLowerCase().includes(term) ||
            !!hero.powers?.some((power) => power.toLowerCase().includes(term))
        );
    }
}
