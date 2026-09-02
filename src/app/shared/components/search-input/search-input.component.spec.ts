import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
    let component: SearchInputComponent;
    let fixture: ComponentFixture<SearchInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchInputComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit the trimmed search term after the debounce time', async () => {
        const searchSpy = vi.fn();
        component.search.subscribe(searchSpy);

        component.control.setValue('  batman  ');
        await new Promise((resolve) => setTimeout(resolve, 600));

        expect(searchSpy).toHaveBeenCalledWith('batman');
    });
});
