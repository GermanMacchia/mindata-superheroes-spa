import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appUppercase]',
    host: {
        '(input)': 'onInput($event)',
    },
})
export class UppercaseDirective implements AfterViewInit {
    constructor(private el: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        const element = this.el.nativeElement;
        if (element instanceof HTMLInputElement) {
            element.value = element.value.toUpperCase();
        } else {
            element.textContent = (element.textContent ?? '').toUpperCase();
        }
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toUpperCase();
    }
}
