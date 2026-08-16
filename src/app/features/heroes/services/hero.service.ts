import { Injectable, signal } from '@angular/core';

import { HEROES_SEED } from '../data/heroes.seed';
import { SuperHero } from '../models/super-hero.model';

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    private readonly heroesSignal = signal<SuperHero[]>(HEROES_SEED);

    readonly heroes = this.heroesSignal.asReadonly();
}
