import { AfterViewInit, Directive, ElementRef, inject, Input, OnChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appUppercase]',
    host: {
        '(input)': 'onInput($event)',
    },
})
export class UppercaseDirective implements AfterViewInit, OnChanges {
    @Input() appUppercase = '';

    private readonly _el = inject(ElementRef<HTMLElement>);
    private readonly _ngControl = inject(NgControl, { optional: true, self: true });

    ngAfterViewInit(): void {
        const element = this._el.nativeElement;
        if (element instanceof HTMLInputElement) {
            this.applyUppercase(element, element.value);
        }
    }

    ngOnChanges(): void {
        const element = this._el.nativeElement;
        if (!(element instanceof HTMLInputElement)) {
            element.textContent = this.appUppercase.toUpperCase();
        }
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.applyUppercase(input, input.value);
    }

    private applyUppercase(input: HTMLInputElement, value: string): void {
        const uppercasedValue = value.toUpperCase();
        input.value = uppercasedValue;
        this._ngControl?.control?.setValue(uppercasedValue);
    }
}
