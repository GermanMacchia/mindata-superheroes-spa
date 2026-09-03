import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { LoadingService } from './core/services/loading.service';

describe('App', () => {
    let loadingService: LoadingService;

    beforeEach(async () => {
        localStorage.removeItem('auth_email');

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [provideRouter([])],
        }).compileComponents();

        loadingService = TestBed.inject(LoadingService);
    });

    afterEach(() => {
        localStorage.removeItem('auth_email');
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should not render the header nor the loading overlay when unauthenticated and idle', () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('app-header')).toBeNull();
        expect(fixture.nativeElement.querySelector('.app__loading-overlay')).toBeNull();
    });

    it('should show the header once authenticated and the overlay while loading', () => {
        localStorage.setItem('auth_email', 'a@a.com');

        const fixture = TestBed.createComponent(App);
        loadingService.start();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('app-header')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.app__loading-overlay')).not.toBeNull();
    });
});
