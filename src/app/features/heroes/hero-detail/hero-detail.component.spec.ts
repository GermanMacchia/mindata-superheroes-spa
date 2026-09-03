import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';

import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
    let component: HeroDetailComponent;
    let fixture: ComponentFixture<HeroDetailComponent>;
    let router: Router;

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
            providers: [provideRouter([])],
        }).compileComponents();

        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);

        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('hero', hero);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate back to the heroes list when calling goBack', () => {
        component.goBack();

        expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should navigate back to the heroes list when clicking the back button', () => {
        fixture.detectChanges();

        const backButton: HTMLButtonElement = fixture.nativeElement.querySelector('.hero-detail__back');
        backButton.click();

        expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });
});
