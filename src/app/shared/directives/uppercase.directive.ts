import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appUppercase]',
    host: {
        '(input)': 'onInput($event)',
    },
})
export class UppercaseDirective implements AfterViewInit, OnChanges {
    @Input() appUppercase = '';

    constructor(private el: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        const element = this.el.nativeElement;
        if (element instanceof HTMLInputElement) {
            element.value = element.value.toUpperCase();
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
        input.value = input.value.toUpperCase();
    }
}
