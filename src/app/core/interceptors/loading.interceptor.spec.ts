import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { withLoadingInterceptor } from './loading.interceptor';

describe('withLoadingInterceptor', () => {
    let loadingService: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        loadingService = TestBed.inject(LoadingService);
    });

    it('should toggle the loading state around the source observable', () => {
        expect(loadingService.isLoading()).toBe(false);

        of('value').pipe(withLoadingInterceptor(loadingService)).subscribe();

        expect(loadingService.isLoading()).toBe(false);
    });
});
