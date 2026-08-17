import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { UppercaseDirective } from '@app/shared/directives/uppercase.directive';

type HeroFormResult = Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>;

@Component({
    selector: 'app-hero-form',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UppercaseDirective,
    ],
    templateUrl: './hero-form.component.html',
    styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<HeroFormComponent, HeroFormResult>);

    readonly universes = ['Marvel', 'DC', 'Otro'];

    readonly form = this.fb.nonNullable.group({
        name: ['', Validators.required],
        realName: [''],
        universe: this.fb.control<SuperHero['universe']>(undefined, Validators.required),
        history: ['', Validators.required],
        imageUrl: [''],
        powers: [''],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, realName, universe, history, imageUrl, powers } = this.form.getRawValue();

        this.dialogRef.close({
            name,
            realName: realName || 'Desconocido',
            universe,
            history,
            imageUrl: imageUrl || undefined,
            powers: powers
                ? powers
                      .split(',')
                      .map((power) => power.trim())
                      .filter(Boolean)
                : undefined,
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
