import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Mock, vi } from 'vitest';

import { HeroFormComponent } from './hero-form.component';

describe('HeroFormComponent', () => {
    let component: HeroFormComponent;
    let fixture: ComponentFixture<HeroFormComponent>;
    let dialogRefClose: Mock;

    beforeEach(async () => {
        dialogRefClose = vi.fn();

        await TestBed.configureTestingModule({
            imports: [HeroFormComponent],
            providers: [{ provide: MatDialogRef, useValue: { close: dialogRefClose } }],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be invalid without name and history', () => {
        expect(component.form.valid).toBeFalsy();
    });

    it('should not close the dialog when submitting an invalid form', () => {
        component.submit();

        expect(dialogRefClose).not.toHaveBeenCalled();
    });

    it('should close the dialog with the parsed payload when submitting a valid form', () => {
        component.form.setValue({
            name: 'Spider-Man',
            realName: 'Peter Parker',
            universe: 'Marvel',
            history: 'Picado por una araña radiactiva.',
            imageUrl: '',
            powers: 'Trepar muros, sentido arácnido',
        });

        component.submit();

        expect(dialogRefClose).toHaveBeenCalledWith({
            name: 'Spider-Man',
            realName: 'Peter Parker',
            universe: 'Marvel',
            history: 'Picado por una araña radiactiva.',
            imageUrl: undefined,
            powers: ['Trepar muros', 'sentido arácnido'],
        });
    });

    it('should close the dialog without a payload when cancelling', () => {
        component.cancel();

        expect(dialogRefClose).toHaveBeenCalledWith();
    });
});
