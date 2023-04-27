import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";

/**
 * @title List with selection
 */
@Component({
  selector: 'taxonomy-filter',
  templateUrl: './taxonomy-filter.component.html',
  styleUrls: ['./taxonomy-filter.component.scss']
})

export class TaxonomyFilterComponent implements OnInit, OnChanges {
  @Input() taxonomies: any[];
  @Input() searchedColumn: string
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();
  selection = new SelectionModel<string>(true, []);

  selectedItems: string[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outputFilteredData']) {
      const values = changes['outputFilteredData'].currentValue;
      if (values && values[this.searchedColumn]) {
        this.selection.clear();
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
        title: this.getTaxonomyTitle(item),
        isChecked: true
      }))
    });
  }

  getTaxonomyTitle(value: string) {
    let title = '';
    this.taxonomies.forEach((taxonomy) => {
      if (taxonomy.value === value) {
        title = taxonomy.title;
        return;
      }
      if (taxonomy.items) {
        taxonomy.items.forEach((secondTaxonomy) => {
          if (secondTaxonomy.value === value) {
            title = secondTaxonomy.title;
            return;
          }

          if (secondTaxonomy.items) {
            secondTaxonomy.items.forEach((item) => {
              if (item.value === value) {
                title = item.title
                return;
              }
            });
          }
        })
      }
    });
    return title;
  }
}
