import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime } from 'rxjs';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { CardComponent } from '@app/shared/components/card/card.component';
import { PaginatedListComponent } from '@app/shared/components/paginated-list/paginated-list.component';

import { HeroService } from '../services/hero.service';

const DEFAULT_PAGE_SIZE = 4;
const PAGE_CHANGE_DEBOUNCE_MS = 250;

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

    // Debounce: clickear varias veces la paginación
    private readonly pageChange = new Subject<PageEvent>();

    constructor() {
        this.fetchData();

        this.pageChange
            .pipe(debounceTime(PAGE_CHANGE_DEBOUNCE_MS), takeUntilDestroyed())
            .subscribe((event) => {
                this.pageIndex.set(event.pageIndex);
                this.pageSize.set(event.pageSize);
                this.fetchData();
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageChange.next(event);
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
