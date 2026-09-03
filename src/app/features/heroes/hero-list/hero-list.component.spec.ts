import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CardComponent } from '@app/shared/components/card/card.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';
import { PaginatedListComponent } from '@app/shared/components/paginated-list/paginated-list.component';
import { SearchInputComponent } from '@app/shared/components/search-input/search-input.component';

import { HEROES_SEED } from '../data/heroes.seed';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { HeroService } from '../services/hero.service';
import { HeroListComponent } from './hero-list.component';

describe('HeroListComponent', () => {
    let component: HeroListComponent;
    let fixture: ComponentFixture<HeroListComponent>;
    let dialog: MatDialog;
    let heroService: HeroService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroListComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroListComponent);
        component = fixture.componentInstance;
        dialog = TestBed.inject(MatDialog);
        heroService = TestBed.inject(HeroService);
        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render one app-card per hero on the current page', async () => {
        // MockApiService simula latencia de red (300ms), esperamos que resuelva.
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        const cards = fixture.debugElement.queryAll(By.directive(CardComponent));

        expect(cards.length).toBe(Math.min(HEROES_SEED.length, component.pageSize()));
    });

    it('should show the empty state when the search yields no matches', async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        component.onSearch('esto-no-existe');
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
        const cards = fixture.debugElement.queryAll(By.directive(CardComponent));

        expect(emptyState).toBeTruthy();
        expect(cards.length).toBe(0);
    });

    it('should debounce page changes and refetch heroes with the new page', async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        component.onPageChange({ pageIndex: 1, pageSize: 2 } as PageEvent);

        await new Promise((resolve) => setTimeout(resolve, 600));
        await fixture.whenStable();

        expect(component.pageIndex()).toBe(1);
        expect(component.pageSize()).toBe(2);
    });

    it('should open the form dialog and create a hero when it resolves with data', () => {
        const payload = { name: 'Test Hero', history: 'Test history' };
        vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(payload) } as MatDialogRef<unknown>);
        const createSpy = vi.spyOn(heroService, 'createHero');

        component.openCreateDialog();

        expect(dialog.open).toHaveBeenCalledWith(HeroFormComponent, { width: '600px', data: undefined });
        expect(createSpy).toHaveBeenCalledWith(payload);
    });

    it('should not create a hero when the create dialog is cancelled', () => {
        vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(undefined) } as MatDialogRef<unknown>);
        const createSpy = vi.spyOn(heroService, 'createHero');

        component.openCreateDialog();

        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should open the form dialog and update a hero when editing', () => {
        const hero = HEROES_SEED[0];
        const payload = { name: 'Updated Name', history: hero.history };
        vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(payload) } as MatDialogRef<unknown>);
        const updateSpy = vi.spyOn(heroService, 'updateHero');

        component.onEdit(hero);

        expect(dialog.open).toHaveBeenCalledWith(HeroFormComponent, { width: '600px', data: hero });
        expect(updateSpy).toHaveBeenCalledWith(hero.id, payload);
    });

    it('should delete a hero when the confirm dialog is accepted', () => {
        const hero = HEROES_SEED[0];
        vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<unknown>);
        const deleteSpy = vi.spyOn(heroService, 'deleteHero');

        component.onDelete(hero);

        expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Eliminar superhéroe',
                message: `¿Seguro que querés eliminar a ${hero.name}? Esta acción no se puede deshacer.`,
            },
        });
        expect(deleteSpy).toHaveBeenCalledWith(hero.id);
    });

    it('should not delete a hero when the confirm dialog is cancelled', () => {
        vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(false) } as MatDialogRef<unknown>);
        const deleteSpy = vi.spyOn(heroService, 'deleteHero');

        component.onDelete(HEROES_SEED[0]);

        expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('should navigate to the hero detail page on view history', () => {
        const hero = HEROES_SEED[0];

        component.onViewHistory(hero);

        expect(router.navigate).toHaveBeenCalledWith(['/heroe', hero.id]);
    });

    it('should wire the card edit/delete/viewHistory outputs to the component handlers', async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        const onEditSpy = vi.spyOn(component, 'onEdit').mockImplementation(() => {});
        const onDeleteSpy = vi.spyOn(component, 'onDelete').mockImplementation(() => {});
        const onViewHistorySpy = vi.spyOn(component, 'onViewHistory').mockImplementation(() => {});

        const card = fixture.debugElement.query(By.directive(CardComponent)).componentInstance as CardComponent;
        const hero = HEROES_SEED[0];

        card.edit.emit(hero);
        card.delete.emit(hero);
        card.viewHistory.emit(hero);

        expect(onEditSpy).toHaveBeenCalledWith(hero);
        expect(onDeleteSpy).toHaveBeenCalledWith(hero);
        expect(onViewHistorySpy).toHaveBeenCalledWith(hero);
    });

    it('should wire the toolbar and paginated-list outputs to the component handlers', async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await fixture.whenStable();

        const onSearchSpy = vi.spyOn(component, 'onSearch').mockImplementation(() => {});
        const openCreateDialogSpy = vi.spyOn(component, 'openCreateDialog').mockImplementation(() => {});
        const onPageChangeSpy = vi.spyOn(component, 'onPageChange').mockImplementation(() => {});

        const searchInput = fixture.debugElement.query(By.directive(SearchInputComponent))
            .componentInstance as SearchInputComponent;
        searchInput.search.emit('batman');

        const createButton: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.hero-list__toolbar button',
        );
        createButton.click();

        const paginatedList = fixture.debugElement.query(By.directive(PaginatedListComponent))
            .componentInstance as PaginatedListComponent;
        paginatedList.pageChange.emit({ pageIndex: 2, pageSize: 4 } as PageEvent);

        expect(onSearchSpy).toHaveBeenCalledWith('batman');
        expect(openCreateDialogSpy).toHaveBeenCalled();
        expect(onPageChangeSpy).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 4 });
    });
});
