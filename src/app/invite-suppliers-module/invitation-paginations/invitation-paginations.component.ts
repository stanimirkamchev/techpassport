import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'invitation-paginations',
  templateUrl: './invitation-paginations.component.html',
  styleUrls: ['./invitation-paginations.component.scss']
})
export class InvitationPaginationsComponent implements OnInit {

  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() size: number;
  @Output() pageSizeChange = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  Array = Array;
  constructor() { }

  get pageCount() {
    return Math.ceil(this.size / this.pageSize ?? 1);
  }

  ngOnInit(): void {
  }

  onPageSizeChange(event) {
    if (!event) { return; }
    this.pageSize = event;
    this.pageSizeChange.emit(event);
  }

  onPageIndexChange(event) {
    if (!event) { return; }
    this.pageIndexChange.emit(event);
  }

  onNextPage() {
    if (this.pageIndex < this.pageCount) {
      this.pageIndexChange.emit(this.pageIndex + 1);
    }
  }

  onPreviousPage() {
    if (this.pageIndex > 1) { this.pageIndexChange.emit(this.pageIndex - 1); }
  }

  renderIndices() {
    if (this.pageIndex >= 5 && this.pageIndex <= this.pageCount - 4) {
      return [1, null, this.pageIndex - 1, this.pageIndex, this.pageIndex + 1, null, this.pageCount];
    }
    if (this.pageIndex < 5) {
      return [1, 2, 3, 4, null, this.pageCount];
    }
    if (this.pageIndex > this.pageCount - 4) {
      return [1, null, this.pageCount - 3, this.pageCount - 2, this.pageCount - 1, this.pageCount];
    }
  }
}
