import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { UppercaseDirective } from '@app/shared/directives/uppercase.directive';

@Component({
    selector: 'app-card',
    imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule, UppercaseDirective],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    readonly hero = input.required<SuperHero>();

    readonly edit = output<SuperHero>();
    readonly delete = output<SuperHero>();
    readonly viewHistory = output<SuperHero>();
}
