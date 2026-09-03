import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '@app/features/auth/services/auth.service';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    private readonly _authService = inject(AuthService);

    readonly userEmail = this._authService.userEmail;

    logout(): void {
        this._authService.logout();
    }
}
