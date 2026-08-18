import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mock, vi } from 'vitest';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefClose: Mock;

    beforeEach(async () => {
        dialogRefClose = vi.fn();

        await TestBed.configureTestingModule({
            imports: [ConfirmDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: { close: dialogRefClose } },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { title: 'Eliminar', message: '¿Confirmás?' },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the dialog with true when confirming', () => {
        component.confirm();

        expect(dialogRefClose).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with false when cancelling', () => {
        component.cancel();

        expect(dialogRefClose).toHaveBeenCalledWith(false);
    });
});
