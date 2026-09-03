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
    private readonly _mockApi = inject(MockApiService);

    constructor() {
        this._mockApi.seed(RESOURCE, HEROES_SEED);
    }

    getHeroes(offset: number, limit: number, search?: string): Observable<PagedResult<SuperHero>> {
        const term = search?.trim().toLowerCase();
        const filter = term ? (hero: SuperHero) => this.matchesSearch(hero, term) : undefined;

        return this._mockApi.paginate<SuperHero>(RESOURCE, offset, limit, filter);
    }

    createHero(data: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>): Observable<SuperHero> {
        const now = new Date();
        const hero: SuperHero = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };

        return this._mockApi.create<SuperHero>(RESOURCE, hero);
    }

    updateHero(
        id: string,
        data: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>,
    ): Observable<SuperHero> {
        return this._mockApi.update<SuperHero>(RESOURCE, id, { ...data, updatedAt: new Date() });
    }

    getHeroById(id: string): Observable<SuperHero | undefined> {
        return this._mockApi.getById<SuperHero>(RESOURCE, id);
    }

    deleteHero(id: string): Observable<void> {
        return this._mockApi.delete<SuperHero>(RESOURCE, id);
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
