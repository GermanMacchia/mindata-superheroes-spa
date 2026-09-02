import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';

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

    nameExists(name: string, excludeId?: string): Observable<boolean> {
        const normalized = name.trim().toLowerCase();

        return this.mockApi.exists<SuperHero>(
            RESOURCE,
            (hero) => hero.id !== excludeId && hero.name.trim().toLowerCase() === normalized,
        );
    }

    createHero(data: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>): Observable<SuperHero> {
        return this.nameExists(data.name).pipe(
            switchMap((duplicate) => {
                if (duplicate) {
                    return throwError(() => new Error('Ya existe un héroe con ese nombre.'));
                }

                const now = new Date();
                const hero: SuperHero = {
                    ...data,
                    id: crypto.randomUUID(),
                    createdAt: now,
                    updatedAt: now,
                };

                return this.mockApi.create<SuperHero>(RESOURCE, hero);
            }),
        );
    }

    updateHero(
        id: string,
        data: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>,
    ): Observable<SuperHero> {
        return this.nameExists(data.name, id).pipe(
            switchMap((duplicate) => {
                if (duplicate) {
                    return throwError(() => new Error('Ya existe un héroe con ese nombre.'));
                }

                return this.mockApi.update<SuperHero>(RESOURCE, id, {
                    ...data,
                    updatedAt: new Date(),
                });
            }),
        );
    }

    getHeroById(id: string): Observable<SuperHero | undefined> {
        return this.mockApi.getById<SuperHero>(RESOURCE, id);
    }

    deleteHero(id: string): Observable<void> {
        return this.mockApi.delete<SuperHero>(RESOURCE, id);
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
