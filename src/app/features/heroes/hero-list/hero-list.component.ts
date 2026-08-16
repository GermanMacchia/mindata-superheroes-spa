import { Component, inject } from '@angular/core';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { CardComponent } from '@app/shared/components/card/card.component';

import { HeroService } from '../services/hero.service';

@Component({
    selector: 'app-hero-list',
    imports: [CardComponent],
    templateUrl: './hero-list.component.html',
    styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
    private readonly heroService = inject(HeroService);

    readonly heroes = this.heroService.heroes;

    onEdit(hero: SuperHero): void {
        console.log('editar', hero);
    }

    onDelete(hero: SuperHero): void {
        console.log('borrar', hero);
    }

    onViewHistory(hero: SuperHero): void {
        console.log('ver historia', hero);
    }
}
