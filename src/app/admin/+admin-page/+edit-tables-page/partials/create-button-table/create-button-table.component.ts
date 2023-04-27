import { Component, Input, OnInit } from '@angular/core';
import { UpdateUserTablePortalComponent } from '../../../../../portal/update-user-table-portal/update-user-table-portal.component';
import { TaxonomyUserTablePortalComponent } from '../../../../../portal/taxonomy-user-table-portal/taxonomy-user-table-portal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'create-button-table',
  templateUrl: './create-button-table.component.html',
  styleUrls: ['./create-button-table.component.scss']
})
export class CreateButtonTableComponent implements OnInit {

  constructor(
    private addDialog: MatDialog,
  ) { }

  @Input() type:string;
  @Input() types: any;


  ngOnInit(): void {
  }

  openModal(type: string, subLevel?: any) {
    const level = type == 'solutions' ? 'type' : null
    if (type !== this.types.Taxonomies) {
      const ref = this.addDialog.open(UpdateUserTablePortalComponent, {
        width: '553px',
        height: '270px',
        maxWidth: undefined,
        panelClass: 'edit-user-table-modal',
        disableClose: false,
        data: { type: type, mode: 'create', subLevel: level }
      });
    } else {
      const ref = this.addDialog.open(TaxonomyUserTablePortalComponent, {
        width: '553px',
        height: '580px',
        maxWidth: undefined,
        panelClass: 'edit-user-table-modal',
        disableClose: false,
        data: { type: type, mode: 'create', subLevel: 'lvl_1' }
      });
    }
  }

}
