import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserTablePortalComponent } from '../../../../../portal/update-user-table-portal/update-user-table-portal.component';
import { DeleteUserTablePortalComponent } from '../../../../../portal/delete-user-table-portal/delete-user-table-portal.component';
import { PopUpService } from '../../../../../shared/pop-up-service';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private addDialog: MatDialog,
    private popUpService: PopUpService,
    public apiService: ApiService,
  ) { }

  @Input() item;
  @Input() entities;
  @Input() type;

  public items = null;

  ngOnInit(): void {
    if (this.entities) {
      this.items = this.entities;
    }
  }

  update(entity) {
    const ref = this.addDialog.open(UpdateUserTablePortalComponent, {
      width: '553px',
      height: '270px',
      maxWidth: undefined,
      panelClass: 'edit-user-table-modal',
      disableClose: false,
      data: { type: this.type, entity, mode: 'update', entities: this.entities }
    });
    ref.afterClosed().subscribe(result => {
      this.popUpService.attachData({ success: false, type: '', items: null });
    });
  }

  create(entity) {
    const ref = this.addDialog.open(UpdateUserTablePortalComponent, {
      width: '650px',
      height: '320px',
      maxWidth: undefined,
      panelClass: 'edit-user-table-modal',
      disableClose: false,
      data: { type: this.type, mode: 'create', entities: this.entities, entity, subLevel: entity.type }
    });
    ref.afterClosed().subscribe(result => {
      this.popUpService.attachData({ success: false, type: '', items: null, });
    });
  }

  remove(entity: any) {
    const payload = { entity: entity._id, name: entity.name, type: null };
    const ref = this.addDialog.open(DeleteUserTablePortalComponent, {
      width: '650px',
      height: '320px',
      maxWidth: undefined,
      panelClass: 'delete-user-table-modal',
      disableClose: false,
      data: { payload, type: this.type }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const message = `Delete ${entity.name} from ${this.type.toUpperCase()}`;
        this.snackBar.open(message, 'success', {
          duration: 2000,
          panelClass: 'snckbar'
        });
        this.popUpService.attachData({ success: true, type: this.type, items: null });
      }
    });
  }

}
