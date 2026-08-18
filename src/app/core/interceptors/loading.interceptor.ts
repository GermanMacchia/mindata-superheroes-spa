import { Observable, finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';

// No hay HttpClient real que interceptar (todo pasa por MockApiService), así que
// esto intercepta a nivel de Observable.
export const withLoadingInterceptor =
    (loadingService: LoadingService) =>
    <T>(source: Observable<T>): Observable<T> => {
        loadingService.start();

        return source.pipe(finalize(() => loadingService.stop()));
    };
