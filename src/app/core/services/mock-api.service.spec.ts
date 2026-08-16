import { TestBed } from '@angular/core/testing';

import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
    let service: MockApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MockApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should paginate a seeded resource by offset and limit', async () => {
        service.seed('numbers', [1, 2, 3, 4, 5]);

        const result = await new Promise((resolve) => {
            service.paginate('numbers', 2, 2).subscribe(resolve);
        });

        expect(result).toEqual({
            items: [3, 4],
            total: 5,
            offset: 2,
            limit: 2,
        });
    });

    it('should return an empty page for an unknown resource', async () => {
        const result = await new Promise((resolve) => {
            service.paginate('unknown', 0, 10).subscribe(resolve);
        });

        expect(result).toEqual({
            items: [],
            total: 0,
            offset: 0,
            limit: 10,
        });
    });
});
