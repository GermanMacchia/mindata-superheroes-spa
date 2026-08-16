import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { CardComponent } from '@app/shared/components/card/card.component';
import { PaginatedListComponent } from '@app/shared/components/paginated-list/paginated-list.component';

import { HeroService } from '../services/hero.service';

const DEFAULT_PAGE_SIZE = 4;

@Component({
    selector: 'app-hero-list',
    imports: [CardComponent, PaginatedListComponent],
    templateUrl: './hero-list.component.html',
    styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
    private readonly heroService = inject(HeroService);

    readonly pageIndex = signal(0);
    readonly pageSize = signal(DEFAULT_PAGE_SIZE);
    readonly heroes = signal<SuperHero[]>([]);
    readonly total = signal(0);

    constructor() {
        this.fetchData();
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.fetchData();
    }

    onEdit(hero: SuperHero): void {
        console.log('editar', hero);
    }

    onDelete(hero: SuperHero): void {
        console.log('borrar', hero);
    }

    onViewHistory(hero: SuperHero): void {
        console.log('ver historia', hero);
    }

    private fetchData(): void {
        const offset = this.pageIndex() * this.pageSize();

        // Sin unsubscribe: getHeroes() completa tras un solo emit
        this.heroService.getHeroes(offset, this.pageSize()).subscribe((result) => {
            this.heroes.set(result.items);
            this.total.set(result.total);
        });
    }
}
