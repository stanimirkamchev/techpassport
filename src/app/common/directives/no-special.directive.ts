import { Directive, HostListener, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[noSpecial]'
})
export class SpecialCharacterDirective {
  regexStr = '^[a-zA-Z0-9!?@#$&() \\-`.+,;:\s\n/"]*$';
  // '^[a-zA-Z0-9_@()&!?"\'£$%#.,;:-+s]*$';//  '^[a-zA-Z0-9_]*$'; //  '^[a-zA-Z0-9_@.-]*$';//
  @Input() isAlphaNumeric: boolean;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }
  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }
  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[~<>{}]/g, '');
      event.preventDefault();
    }, 100);
  }
}
