import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';

@Component({
    selector: 'app-card',
    imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
})
export class CardComponent {
    readonly hero = input.required<SuperHero>();

    readonly edit = output<SuperHero>();
    readonly delete = output<SuperHero>();
    readonly viewHistory = output<SuperHero>();
}
