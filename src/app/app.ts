import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from './features/auth/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, MatProgressSpinnerModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('mindata-superheroes-spa');
    protected readonly authService = inject(AuthService);
    protected readonly loadingService = inject(LoadingService);
}
