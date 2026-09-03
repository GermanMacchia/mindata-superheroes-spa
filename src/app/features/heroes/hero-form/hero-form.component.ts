import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SuperHero } from '@app/features/heroes/models/super-hero.model';
import { HeroService } from '@app/features/heroes/services/hero.service';
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
    private readonly data = inject<SuperHero | undefined>(MAT_DIALOG_DATA, { optional: true });
    private readonly heroService = inject(HeroService);

    readonly isEdit = !!this.data;
    readonly universes = ['Marvel', 'DC', 'Otro'];

    readonly form = this.fb.nonNullable.group({
        name: [this.data?.name ?? '', Validators.required],
        realName: [this.data?.realName ?? ''],
        universe: this.fb.control<SuperHero['universe']>(this.data?.universe, Validators.required),
        history: [this.data?.history ?? '', Validators.required],
        imageUrl: [this.data?.imageUrl ?? ''],
        powers: [this.data?.powers?.join(', ') ?? ''],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, realName, universe, history, imageUrl, powers } = this.form.getRawValue();

        this.heroService.nameExists(name, this.data?.id).subscribe((duplicate) => {
            if (duplicate) {
                this.form.controls.name.setErrors({ duplicateName: true });
                this.form.controls.name.markAsTouched();
                return;
            }

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
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
