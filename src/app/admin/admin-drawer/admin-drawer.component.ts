import { Component, OnInit, OnChanges, ChangeDetectionStrategy, ElementRef, HostListener } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrls: ['./admin-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDrawerComponent implements OnInit, OnChanges {
  numberOfTicks = 0;

  constructor(public apiService: ApiService, protected elementRef: ElementRef, public ref: ChangeDetectorRef) {
    setInterval(() => {
      this.ref.detectChanges();
    }, 50);

    setInterval(() => {
      this.numberOfTicks++;
      this.ref.markForCheck();
    }, 50);
  }

  @HostListener('document:click', ['$event.target']) onClick(event) {
    this.ref.detectChanges();
  }
  @HostListener('keyup', ['$event']) ngOnChanges() {
    this.ref.detectChanges();
  }

  get apiSession() {
    console.log(this.apiService.sessionObject);
    return this.apiService.sessionObject;
  }

  ngOnInit() {
    setInterval(() => {
      this.ref.detectChanges();
    }, 50);
  }

}
