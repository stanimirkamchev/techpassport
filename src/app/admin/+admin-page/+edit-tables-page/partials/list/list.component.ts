import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    public apiService: ApiService,
  ) {}

  @Input() entities;
  @Input() type;

  public items = null;

  ngOnInit(): void {
    if (this.entities && this.entities.length > 0) {
      const arrayForSort = [...this.entities]
      this.items = arrayForSort.sort((a:any, b:any) => a.name.localeCompare(b.name))
    }
  }
}
