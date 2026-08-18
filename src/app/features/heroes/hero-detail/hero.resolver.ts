import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';

import { HeroService } from '../services/hero.service';

export const heroResolver: ResolveFn<SuperHero> = (route) => {
    const heroService = inject(HeroService);
    const router = inject(Router);
    const id = route.paramMap.get('id')!;

    return heroService.getHeroById(id).pipe(
        tap((hero) => {
            if (!hero) router.navigate(['/heroes']);
        }),
        filter((hero: SuperHero | undefined) => !!hero),
    );
};
