import { Routes } from '@angular/router';

import { appGuard, authGuard } from './core/guards/auth.guard';
import { heroResolver } from './features/heroes/hero-detail/hero.resolver';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then((m) => m.LoginComponent),
        canActivate: [appGuard],
    },
    {
        path: 'heroes',
        loadComponent: () =>
            import('./features/heroes/hero-list/hero-list.component').then(
                (m) => m.HeroListComponent,
            ),
        canActivate: [authGuard],
    },
    {
        path: 'heroe/:id',
        loadComponent: () =>
            import('./features/heroes/hero-detail/hero-detail.component').then(
                (m) => m.HeroDetailComponent,
            ),
        canActivate: [authGuard],
        resolve: { hero: heroResolver },
    },
    { path: '', pathMatch: 'full', redirectTo: 'heroes' },
    { path: '**', redirectTo: 'heroes' },
];
