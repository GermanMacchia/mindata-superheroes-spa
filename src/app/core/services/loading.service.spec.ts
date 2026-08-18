import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoadingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should toggle isLoading between start and stop', () => {
        expect(service.isLoading()).toBe(false);

        service.start();
        expect(service.isLoading()).toBe(true);

        service.stop();
        expect(service.isLoading()).toBe(false);
    });
});
