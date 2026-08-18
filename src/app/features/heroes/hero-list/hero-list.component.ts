import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { CardComponent } from '@app/shared/components/card/card.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';
import { PaginatedListComponent } from '@app/shared/components/paginated-list/paginated-list.component';
import { SearchInputComponent } from '@app/shared/components/search-input/search-input.component';

import { HeroFormComponent } from '../hero-form/hero-form.component';
import { HeroService } from '../services/hero.service';

const DEFAULT_PAGE_SIZE = 4;
const PAGE_CHANGE_DEBOUNCE_MS = 250;

@Component({
    selector: 'app-hero-list',
    imports: [
        CardComponent,
        EmptyStateComponent,
        PaginatedListComponent,
        SearchInputComponent,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './hero-list.component.html',
    styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
    private readonly heroService = inject(HeroService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);

    readonly pageIndex = signal(0);
    readonly pageSize = signal(DEFAULT_PAGE_SIZE);
    readonly heroes = signal<SuperHero[]>([]);
    readonly total = signal(0);
    readonly searchTerm = signal('');

    readonly noResults = computed(() => this.heroes().length === 0 && this.searchTerm().length > 0);

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

    openCreateDialog(): void {
        this.openHeroDialog();
    }

    onEdit(hero: SuperHero): void {
        this.openHeroDialog(hero);
    }

    private openHeroDialog(hero?: SuperHero): void {
        this.dialog
            .open(HeroFormComponent, { width: '600px', data: hero })
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;

                const request = hero
                    ? this.heroService.updateHero(hero.id, result)
                    : this.heroService.createHero(result);

                request.subscribe(() => this.fetchData());
            });
    }

    onDelete(hero: SuperHero): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                width: '400px',
                data: {
                    title: 'Eliminar superhéroe',
                    message: `¿Seguro que querés eliminar a ${hero.name}? Esta acción no se puede deshacer.`,
                },
            })
            .afterClosed()
            .subscribe((confirmed) => {
                if (!confirmed) return;

                this.heroService.deleteHero(hero.id).subscribe(() => this.fetchData());
            });
    }

    onViewHistory(hero: SuperHero): void {
        this.router.navigate(['/heroe', hero.id]);
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
