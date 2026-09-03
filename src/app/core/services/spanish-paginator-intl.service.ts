import { MatPaginatorIntl } from '@angular/material/paginator';

export function createSpanishPaginatorIntl(): MatPaginatorIntl {
    const intl = new MatPaginatorIntl();

    intl.itemsPerPageLabel = 'Elementos por página:';
    intl.nextPageLabel = 'Página siguiente';
    intl.previousPageLabel = 'Página anterior';
    intl.firstPageLabel = 'Primera página';
    intl.lastPageLabel = 'Última página';
    intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
        }

        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);

        return `${startIndex + 1} – ${endIndex} de ${length}`;
    };

    return intl;
}
