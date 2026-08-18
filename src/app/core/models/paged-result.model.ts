export interface PagedResult<T> {
    items: T[];
    total: number;
    offset: number;
    limit: number;
}
