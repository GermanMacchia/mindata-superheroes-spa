import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appUppercase]',
    host: {
        '(input)': 'onInput($event)',
    },
})
export class UppercaseDirective implements AfterViewInit, OnChanges {
    @Input() appUppercase = '';

    constructor(
        private el: ElementRef<HTMLElement>,
        @Optional() @Self() private ngControl: NgControl,
    ) { }

    ngAfterViewInit(): void {
        const element = this.el.nativeElement;
        if (element instanceof HTMLInputElement) {
            this.applyUppercase(element, element.value);
        }
    }

    ngOnChanges(): void {
        const element = this.el.nativeElement;
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
        this.ngControl?.control?.setValue(uppercasedValue);
    }
}
