import { Routes } from '@angular/router';

import { appGuard, authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { HeroListComponent } from './features/heroes/hero-list/hero-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [appGuard] },
    { path: 'heroes', component: HeroListComponent, canActivate: [authGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'heroes' },
    { path: '**', redirectTo: 'heroes' },
];
