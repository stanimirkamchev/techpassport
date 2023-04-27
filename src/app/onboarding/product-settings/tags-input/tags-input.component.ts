import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  Inject,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { debounce, debounceTime, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { FormTracker } from '../../form-tracker';
import { filter } from 'd3';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AddTagModalComponent } from '../add-tag-modal/add-tag-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './tags-input.component.html',
  selector: 'tags-input',
  styleUrls: ['./tags-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagsInputComponent),
    multi: true
  }]
})
export class TagsInputComponent extends Destroyable implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() caption: string;
  @Input() placeholder: string;
  @Input() maxLength = 3;
  @Input() enableNewButton = false;
  @Output() onAddNew = new EventEmitter();
  @Input() searchType: 'tag' | 'solution' = 'tag';
  @Input() isError: boolean;
  @Input() errorText: string;
  @ViewChild('input', { static: false }) public input: ElementRef;
  onChangeFn: Function;
  onTouched: Function;
  tags: string[] = [];
  tagOptions$: Observable<any[]>;
  tagOptions: any[] = [];
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) inputAutoComplete: MatAutocompleteTrigger;
  @ViewChild(MatAutocomplete, { read: MatAutocomplete }) autoComplete: MatAutocomplete;

  readonly separatorKeysCodes = []; // [ENTER, COMMA] as const;
  addOnBlur = false;
  query = new FormControl('');
  isAdding = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private tracker: FormTracker,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.startSearch();
  }

  startSearch() {
    this.query.valueChanges.pipe(
      startWith(''),
      switchMap((t: any) => {
        switch (this.searchType) {
          case 'tag':
            return this.apiService.searchTags(t);
          case 'solution':
            return this.apiService.searchSolutions(t);
        }
      }),
      map(t => {
        if (this.searchType === 'solution') {
          t = t.body.filter(tag => !this.tags.includes(tag.name));
          const groups = t.reduce((gr, item) => {
            const group = (gr[item.type] || []);
            group.push(item);
            gr[item.type] = group;
            return gr;
          }, {});
          const items = Object.entries(groups || {}).map((k) => ({
            label: k[0],
            children: k[1]
          }));
          if (items.length === 0) {
            return [{ label: '', hide: true, children: [{ name: '', disable: true }] }];
          }
          return items;
        } else {
          const items = t.body.filter(tag => !this.tags.includes(tag.name));
          if (items.length === 0) {
            return [{ name: '', disable: true }];
          }
          return items;
        }
      }),
      debounceTime(1000)
    ).subscribe(res => {
      this.tagOptions = res;
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    event.input.value = '';
    this.query.setValue('');

    this.cdRef.detectChanges();
    this.onChange();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.cdRef.detectChanges();
    this.onChange();
  }

  addNew() {
    // const value = (this.query.value || '').trim();

    // if (value && this.searchType == 'tag' && !this.haveTag) {
    //   this.query.setValue("")

    //   this.input.nativeElement.value = ""
    //   this.input.nativeElement.blur()

    //   this.isAdding = true
    //   this.apiService.addTag(value).subscribe(t => {
    //     this.isAdding = false
    //     this.tags.push(value);
    //     this.onChange()
    //     this.cdRef.detectChanges()
    //   })
    // }

    this.onAddNew.emit();
  }

  selected(event) {
    const value = (event.option.value || '').trim();

    if (value) {
      this.tags.push(value);
    }
    this.input.nativeElement.value = '';
    this.input.nativeElement.blur();
    this.query.setValue('');

    this.cdRef.detectChanges();
    this.onChange();
  }

  onClickInput(event) {
    let cl = ' .mat-form-field.tags-input';
    if (this.searchType) {
      cl = '.' + this.searchType + cl;
    }

    if (this.query.value === '') {
      const apiFunc = this.searchType === 'solution' ? this.apiService.searchSolutions('') : this.apiService.searchTags('');
      apiFunc.subscribe(t => {
        if (this.searchType === 'solution') {
          t = t.body.filter(tag => !this.tags.includes(tag.name));
          const groups = t.reduce((gr, item) => {
            const group = (gr[item.type] || []);
            group.push(item);
            gr[item.type] = group;
            return gr;
          }, {});
          const items = Object.entries(groups || {}).map((k) => ({
            label: k[0],
            children: k[1]
          }));
          if (items.length === 0) {
            this.tagOptions = [{ label: '', hide: true, children: [{ name: '', disable: true }] }];
          }
          this.tagOptions = items;
        } else {
          const items = t.body.filter(tag => !this.tags.includes(tag.name));
          if (items.length === 0) {
            this.tagOptions = [{ name: '', disable: true }];
          }
          this.tagOptions = items;
        }
        this.cdRef.detectChanges();
        this.onChange();
      });
    }

    const tagBox = document.querySelector(cl);
    event.stopPropagation();
    this.inputAutoComplete.autocompleteDisabled = true;
    if (!this.inputAutoComplete.panelOpen) {
      setTimeout(() => {
        this.inputAutoComplete.openPanel();
        const dropdown = document.querySelector<HTMLElement>('.mat-autocomplete-panel');
        if (this.inputAutoComplete.position === 'above') {
          dropdown.style.marginBottom = `${20 + tagBox.scrollHeight - tagBox.clientHeight}px`;
        } else {
          dropdown.style.marginTop = `${20 + tagBox.scrollHeight - tagBox.clientHeight}px`;
        }
        this.inputAutoComplete.autocompleteDisabled = false;
      }, 200);
    }
  }

  onBlur(event) {
    this.inputAutoComplete.closePanel();
  }

  writeValue(value: any): void {
    this.tags = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange() {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(this.tags);
    }
  }
}
