import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroFormComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _dialogRef = inject(MatDialogRef<HeroFormComponent, HeroFormResult>);
    private readonly _data = inject<SuperHero | undefined>(MAT_DIALOG_DATA, { optional: true });
    private readonly _heroService = inject(HeroService);

    readonly isEdit = !!this._data;
    readonly universes = ['Marvel', 'DC', 'Otro'];

    readonly form = this._fb.nonNullable.group({
        name: [this._data?.name ?? '', Validators.required],
        realName: [this._data?.realName ?? ''],
        universe: this._fb.control<SuperHero['universe']>(
            this._data?.universe,
            Validators.required,
        ),
        history: [this._data?.history ?? '', Validators.required],
        imageUrl: [this._data?.imageUrl ?? ''],
        powers: [this._data?.powers?.join(', ') ?? ''],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, realName, universe, history, imageUrl, powers } = this.form.getRawValue();

        this._heroService.nameExists(name, this._data?.id).subscribe((duplicate) => {
            if (duplicate) {
                this.form.controls.name.setErrors({ duplicateName: true });
                this.form.controls.name.markAsTouched();
                return;
            }

            this._dialogRef.close({
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
        this._dialogRef.close();
    }
}
