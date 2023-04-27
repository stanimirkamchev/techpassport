import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { FormControl } from "@angular/forms";

/**
 * @title List with selection
 */
@Component({
  selector: 'usecase-filter',
  templateUrl: './usecase-filter.component.html',
  styleUrls: ['./usecase-filter.component.scss']
})

export class UsecaseFilterComponent implements OnInit, OnChanges {
  @Input() searchedColumn: string
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();
  selection = new SelectionModel<string>(true, []);

  selectedItems: string[] = [];
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = false;
  query = new FormControl('')

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outputFilteredData']) {
      const values = changes['outputFilteredData'].currentValue;
      if (values && values[this.searchedColumn]) {
        this.selection.select(...values[this.searchedColumn].map((item) => item.name));
      }
    }
  }

  public onChange(option: any) {
    if(this.selection.isSelected(option.value)) {
      this.selection.deselect(option.value)
    } else {
      this.selection.select(option.value);

      if (option.items) {
        option.items.forEach((item) => {
          this.selection.select(item.value);
          if (item.items) {
            this.selection.select(...item.items.map((child) => child.value))
          }
        })
      }
    }

    this.outputSelectedItems.emit({
      column: this.searchedColumn,
      items: this.selection.selected.map((item) => ({
        name: item,
        isChecked: true
      }))
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    event.input.value = '';
    this.query.setValue("")

    this.cdRef.detectChanges()
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.cdRef.detectChanges();
  }
}
