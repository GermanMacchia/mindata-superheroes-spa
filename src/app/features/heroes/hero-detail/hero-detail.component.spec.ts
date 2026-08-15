import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
    let component: HeroDetailComponent;
    let fixture: ComponentFixture<HeroDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
