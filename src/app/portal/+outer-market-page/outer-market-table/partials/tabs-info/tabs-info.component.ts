import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tabs-info',
  templateUrl: './tabs-info.component.html',
  styleUrls: ['./tabs-info.component.scss']
})
export class TabsInfoComponent implements OnInit {
  constructor() { }
  @Input() investors: [];
  @Input() acquirers: [];
  @Input() competitors: [];
  ngOnInit(): void { }
}
