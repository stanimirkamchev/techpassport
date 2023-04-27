import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * @title List with selection
 */
@Component({
  selector: 'suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.scss']
})

export class SuggestionListComponent implements OnInit, OnChanges {
  @Input() data: string[] = [];
  @Input() searchedColumn: string;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();
  selection = new SelectionModel<string>(true, []);

  searchTerm = '';
  filteredData: string[] = this.data;
  private $behaviorSearch = new BehaviorSubject(this.searchTerm);
  public readonly searchObserver: Observable<string> = this.$behaviorSearch.asObservable();

  ngOnInit() {
    this.filteredData = this.data;

    this.searchObserver.subscribe((searchTerm) => {
      this.filteredData = this.data.filter((item) => item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
    this.selection.select(...
      (this.outputFilteredData && this.outputFilteredData[this.searchedColumn]
        ? this.outputFilteredData[this.searchedColumn].map((item) => item.name)
        : [])
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.outputFilteredData) {
      const values = changes.outputFilteredData.currentValue;
      if (values && values[this.searchedColumn]) {
        this.selection.clear();
        this.selection.select(...values[this.searchedColumn].map((item) => item.name));
      }
    }
  }

  public onChangeSearchTerm(e: any) {
    this.$behaviorSearch.next(e.target.value);
  }

  public onChange(item: string) {
    this.selection.toggle(item);

    this.outputSelectedItems.emit({
      column: this.searchedColumn,
      items: this.selection.selected.map((el) => ({
        name: el,
        isChecked: true
      }))
    });
  }
}
