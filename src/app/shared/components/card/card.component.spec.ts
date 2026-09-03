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
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the hero image, subtitle and universe footer', () => {
        const image: HTMLImageElement = fixture.nativeElement.querySelector('.card__image');
        const subtitle: HTMLElement = fixture.nativeElement.querySelector('.card__subtitle');
        const footer: HTMLElement = fixture.nativeElement.querySelector('.card__footer');

        expect(image.src).toBe(MOCK_HERO.imageUrl);
        expect(image.alt).toBe(MOCK_HERO.name);
        expect(subtitle.textContent).toContain(MOCK_HERO.realName);
        expect(footer.textContent).toContain(MOCK_HERO.universe);
    });

    it('should fall back to the default image and hide subtitle/footer when hero has no realName, universe or imageUrl', () => {
        const minimalHero: SuperHero = { ...MOCK_HERO, realName: '', universe: undefined, imageUrl: '' };
        fixture.componentRef.setInput('hero', minimalHero);
        fixture.detectChanges();

        const image: HTMLImageElement = fixture.nativeElement.querySelector('.card__image');
        const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
        const footer = fixture.nativeElement.querySelector('.card__footer');

        expect(image.src).toContain('/no-photo.webp');
        expect(subtitle).toBeNull();
        expect(footer).toBeNull();
    });

    it('should emit viewHistory when clicking the overlay', () => {
        const viewHistorySpy = vi.fn();
        component.viewHistory.subscribe(viewHistorySpy);

        const overlay: HTMLElement = fixture.nativeElement.querySelector('.card__overlay');
        overlay.click();

        expect(viewHistorySpy).toHaveBeenCalledWith(MOCK_HERO);
    });

    it('should emit edit and stop the overlay click from firing viewHistory', () => {
        const editSpy = vi.fn();
        const viewHistorySpy = vi.fn();
        component.edit.subscribe(editSpy);
        component.viewHistory.subscribe(viewHistorySpy);

        const editButton: HTMLButtonElement = fixture.nativeElement.querySelector('.card__overlay-action--edit');
        editButton.click();

        expect(editSpy).toHaveBeenCalledWith(MOCK_HERO);
        expect(viewHistorySpy).not.toHaveBeenCalled();
    });

    it('should emit delete and stop the overlay click from firing viewHistory', () => {
        const deleteSpy = vi.fn();
        const viewHistorySpy = vi.fn();
        component.delete.subscribe(deleteSpy);
        component.viewHistory.subscribe(viewHistorySpy);

        const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector(
            '.card__overlay-action--delete',
        );
        deleteButton.click();

        expect(deleteSpy).toHaveBeenCalledWith(MOCK_HERO);
        expect(viewHistorySpy).not.toHaveBeenCalled();
    });
});
