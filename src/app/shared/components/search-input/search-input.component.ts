import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';

const SEARCH_DEBOUNCE_MS = 500;

@Component({
    selector: 'app-search-input',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
    ],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
    private readonly _destroyRef = inject(DestroyRef);

    readonly searchChange = output<string>();

    readonly control = new FormControl('', { nonNullable: true });

    constructor() {
        this.control.valueChanges
            .pipe(
                debounceTime(SEARCH_DEBOUNCE_MS),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe((value) => this.searchChange.emit(value.trim()));
    }
}
