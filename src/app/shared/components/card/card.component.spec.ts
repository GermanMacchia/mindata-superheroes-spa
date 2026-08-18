import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';

import { CardComponent } from './card.component';

const MOCK_HERO: SuperHero = {
    id: 'mock-id',
    name: 'Superman',
    realName: 'Clark Kent',
    powers: ['Vuelo'],
    universe: 'DC',
    history: 'Historia de prueba.',
    imageUrl: 'https://ui-avatars.com/api/?name=Superman',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('hero', MOCK_HERO);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
