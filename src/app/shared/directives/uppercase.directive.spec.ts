import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UppercaseDirective } from './uppercase.directive';

@Component({
    imports: [UppercaseDirective],
    template: `<input appUppercase [value]="value" />`,
})
class InputHostComponent {
    value = '';
}

@Component({
    imports: [UppercaseDirective],
    template: `<span [appUppercase]="text()"></span>`,
})
class TextHostComponent {
    text = signal('');
}

@Component({
    imports: [ReactiveFormsModule, UppercaseDirective],
    template: `<input appUppercase [formControl]="control" />`,
})
class ReactiveFormHostComponent {
    control = new FormControl('hulk', { nonNullable: true });
}

describe('UppercaseDirective', () => {
    it('should uppercase an input value on init', () => {
        TestBed.configureTestingModule({ imports: [InputHostComponent] });
        const fixture: ComponentFixture<InputHostComponent> = TestBed.createComponent(InputHostComponent);
        fixture.componentInstance.value = 'hulk';
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('HULK');
    });

    it('should uppercase the value as the user types', () => {
        TestBed.configureTestingModule({ imports: [InputHostComponent] });
        const fixture: ComponentFixture<InputHostComponent> = TestBed.createComponent(InputHostComponent);
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'loki';
        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('LOKI');
    });

    it('should uppercase a non-input element text content on init', () => {
        TestBed.configureTestingModule({ imports: [TextHostComponent] });
        const fixture: ComponentFixture<TextHostComponent> = TestBed.createComponent(TextHostComponent);
        fixture.componentInstance.text.set('thor');
        fixture.detectChanges();

        const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
        expect(span.textContent).toBe('THOR');
    });

    it('should update a non-input element text content when the bound value changes', () => {
        TestBed.configureTestingModule({ imports: [TextHostComponent] });
        const fixture: ComponentFixture<TextHostComponent> = TestBed.createComponent(TextHostComponent);
        fixture.componentInstance.text.set('thor');
        fixture.detectChanges();

        fixture.componentInstance.text.set('loki');
        fixture.detectChanges();

        const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
        expect(span.textContent).toBe('LOKI');
    });

    it('should sync the FormControl with the uppercased initial value', () => {
        TestBed.configureTestingModule({ imports: [ReactiveFormHostComponent] });
        const fixture: ComponentFixture<ReactiveFormHostComponent> = TestBed.createComponent(ReactiveFormHostComponent);
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('HULK');
        expect(fixture.componentInstance.control.value).toBe('HULK');
    });

    it('should sync the FormControl as the user types', () => {
        TestBed.configureTestingModule({ imports: [ReactiveFormHostComponent] });
        const fixture: ComponentFixture<ReactiveFormHostComponent> = TestBed.createComponent(ReactiveFormHostComponent);
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.value = 'loki';
        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('LOKI');
        expect(fixture.componentInstance.control.value).toBe('LOKI');
    });
});
