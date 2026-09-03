import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-paginated-list',
    imports: [MatPaginatorModule],
    templateUrl: './paginated-list.component.html',
    styleUrl: './paginated-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedListComponent {
    readonly total = input.required<number>();
    readonly pageIndex = input(0);
    readonly pageSize = input(8);
    readonly pageSizeOptions = input([4, 8, 12, 16]);

    readonly pageChange = output<PageEvent>();

    onPage(event: PageEvent): void {
        this.pageChange.emit(event);
    }
}
