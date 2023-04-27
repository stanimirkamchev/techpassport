
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[noNA], textarea[noNA]' //
})
export class NoNADirective {

  private badOnes =["na","n/a","not applicable","not available"];

  constructor(private _el: ElementRef) { }
// TO DO
  @HostListener('input', ['$event']) onInputChange(event) {
    let initalValue = this._el.nativeElement.value;
    let checkedValue = this._el.nativeElement.value.toLowerCase();
    for (let bad of this.badOnes){
      let ind = checkedValue.indexOf(bad);
      if (ind > -1) {
        let b = checkedValue[ind-1];
        //let a = checkedValue[ind+bad.length];
        if ( b === undefined || b === " ") {
          let badCamCas = initalValue.slice(ind, ind + bad.length );
          let re = new RegExp(badCamCas,"g");
          this._el.nativeElement.value = this._el.nativeElement.value.replace(re, "");
        }
      }
    }
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
