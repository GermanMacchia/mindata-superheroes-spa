import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime } from 'rxjs';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { CardComponent } from '@app/shared/components/card/card.component';
import { PaginatedListComponent } from '@app/shared/components/paginated-list/paginated-list.component';
import { SearchInputComponent } from '@app/shared/components/search-input/search-input.component';

import { HeroService } from '../services/hero.service';

const DEFAULT_PAGE_SIZE = 4;
const PAGE_CHANGE_DEBOUNCE_MS = 250;

@Component({
    selector: 'app-hero-list',
    imports: [CardComponent, PaginatedListComponent, SearchInputComponent],
    templateUrl: './hero-list.component.html',
    styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
    private readonly heroService = inject(HeroService);
    private readonly destroyRef = inject(DestroyRef);

    readonly pageIndex = signal(0);
    readonly pageSize = signal(DEFAULT_PAGE_SIZE);
    readonly heroes = signal<SuperHero[]>([]);
    readonly total = signal(0);
    readonly searchTerm = signal('');

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

    onSearch(term: string): void {
        this.searchTerm.set(term);
        this.pageIndex.set(0);
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

        this.heroService
            .getHeroes(offset, this.pageSize(), this.searchTerm())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.heroes.set(result.items);
                this.total.set(result.total);
            });
    }
}
