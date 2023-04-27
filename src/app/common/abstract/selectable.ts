import { HostListener, ElementRef, EventEmitter, Output, Directive, Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Identifiable } from './identifiable';

export interface Selected<T extends Identifiable> {
  _id: string;
  item: T;
}

@Injectable()
export abstract class Selectable<T extends Identifiable> {

  @Output() sort = new EventEmitter<Sort>();

  constructor(protected elementRef: ElementRef) {}

  selected: Selected<T>;

  select(item: T) {
    this.selected = this.selected && this.selected._id === item._id ? null : { item, _id: item._id };
  }

  @HostListener('document:mousedown', ['$event']) onDocumentClick(event: Event) {
    this.selected = !this.elementRef.nativeElement.contains(event.target) ? null : this.selected;
  }
}
