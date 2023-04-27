
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = initialValue.replace(/[^0-9]/g, '');
    if ( initialValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
