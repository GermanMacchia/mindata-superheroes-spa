import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormComponent } from './hero-form.component';

describe('HeroFormComponent', () => {
    let component: HeroFormComponent;
    let fixture: ComponentFixture<HeroFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
