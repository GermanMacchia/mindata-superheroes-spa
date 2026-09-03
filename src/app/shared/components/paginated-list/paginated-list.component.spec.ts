import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';

import { PaginatedListComponent } from './paginated-list.component';

describe('PaginatedListComponent', () => {
    let component: PaginatedListComponent;
    let fixture: ComponentFixture<PaginatedListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginatedListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PaginatedListComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('total', 0);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit pageChange when onPage is called', () => {
        const pageChangeSpy = vi.fn();
        component.pageChange.subscribe(pageChangeSpy);
        const event = { pageIndex: 1, pageSize: 8 } as PageEvent;

        component.onPage(event);

        expect(pageChangeSpy).toHaveBeenCalledWith(event);
    });

    it('should emit pageChange when the paginator emits a page event', () => {
        fixture.detectChanges();
        const pageChangeSpy = vi.fn();
        component.pageChange.subscribe(pageChangeSpy);
        const event = { pageIndex: 2, pageSize: 12 } as PageEvent;

        const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
        paginator.page.emit(event);

        expect(pageChangeSpy).toHaveBeenCalledWith(event);
    });
});
