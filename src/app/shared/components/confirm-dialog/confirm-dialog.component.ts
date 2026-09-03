import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
    private readonly _dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);

    readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    confirm(): void {
        this._dialogRef.close(true);
    }

    cancel(): void {
        this._dialogRef.close(false);
    }
}
