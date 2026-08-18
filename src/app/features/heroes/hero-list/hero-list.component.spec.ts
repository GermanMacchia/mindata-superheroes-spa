import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardComponent } from '@app/shared/components/card/card.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';

import { HEROES_SEED } from '../data/heroes.seed';
import { HeroListComponent } from './hero-list.component';

describe('HeroListComponent', () => {
    let component: HeroListComponent;
    let fixture: ComponentFixture<HeroListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroListComponent);
        component = fixture.componentInstance;
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
});
