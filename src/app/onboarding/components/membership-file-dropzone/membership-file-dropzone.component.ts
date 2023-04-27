import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";

@Component({
  selector: 'membership-file-dropzone',
  templateUrl: './membership-file-dropzone.component.html',
  styleUrls: ['./membership-file-dropzone.component.scss']
})
export class MembershipFileDropzoneComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() icon: boolean = true;

  files: File[] = [];

  constructor(public router: Router) {}

  ngOnInit() {
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
