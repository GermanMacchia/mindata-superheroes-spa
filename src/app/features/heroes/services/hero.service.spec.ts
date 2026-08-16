import { TestBed } from '@angular/core/testing';

import { HEROES_SEED } from '../data/heroes.seed';
import { HeroService } from './hero.service';

describe('HeroService', () => {
    let service: HeroService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HeroService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a page of heroes from the seed', async () => {
        const result = await new Promise((resolve) => {
            service.getHeroes(0, 8).subscribe(resolve);
        });

        expect(result).toEqual({
            items: HEROES_SEED.slice(0, 8),
            total: HEROES_SEED.length,
            offset: 0,
            limit: 8,
        });
    });
});
