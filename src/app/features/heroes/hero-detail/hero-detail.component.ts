import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { UppercaseDirective } from '@app/shared/directives/uppercase.directive';

@Component({
    selector: 'app-hero-detail',
    imports: [MatButtonModule, MatIconModule, MatChipsModule, UppercaseDirective],
    templateUrl: './hero-detail.component.html',
    styleUrl: './hero-detail.component.scss',
})
export class HeroDetailComponent {
    private readonly router = inject(Router);

    readonly hero = input.required<SuperHero>();

    goBack(): void {
        this.router.navigate(['/heroes']);
    }
}
