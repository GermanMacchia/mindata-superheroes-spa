import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-empty-state',
    imports: [MatIconModule],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
    readonly icon = input('search_off');
    readonly message = input.required<string>();
}
