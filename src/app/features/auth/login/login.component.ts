import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _authService = inject(AuthService);

    readonly form = this._fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    private readonly _formValue = toSignal(this.form.valueChanges, {
        initialValue: this.form.getRawValue(),
    });

    readonly bothEmpty = computed(() => {
        const { email, password } = this._formValue();
        return !email?.trim() && !password?.trim();
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { email, password } = this.form.getRawValue();
        this._authService.login(email, password);
    }
}
