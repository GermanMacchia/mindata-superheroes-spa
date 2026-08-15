import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
