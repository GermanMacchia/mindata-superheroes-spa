import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';

import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
    let component: HeroDetailComponent;
    let fixture: ComponentFixture<HeroDetailComponent>;

    const hero: SuperHero = {
        id: '1',
        name: 'Spider-Man',
        realName: 'Peter Parker',
        universe: 'Marvel',
        powers: ['Trepar muros', 'Sentido arácnido'],
        history: 'Picado por una araña radiactiva.',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('hero', hero);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
