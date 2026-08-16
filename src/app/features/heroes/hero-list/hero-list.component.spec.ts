import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardComponent } from '@app/shared/components/card/card.component';

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

    it('should render one app-card per hero from HeroService', () => {
        const cards = fixture.debugElement.queryAll(By.directive(CardComponent));

        expect(cards.length).toBe(HEROES_SEED.length);
    });
});
