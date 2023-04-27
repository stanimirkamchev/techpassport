import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaxonomyUserTablePortalComponent } from '../../../../../portal/taxonomy-user-table-portal/taxonomy-user-table-portal.component';
import { PopUpService } from '../../../../../shared/pop-up-service';
import { ApiService } from '@services/api/api.service';
import { Types } from '../simple-table/simple-table.component';
import { DeleteUserTablePortalComponent } from '../../../../../portal/delete-user-table-portal/delete-user-table-portal.component';

@Component({
  selector: 'taxonomy-list',
  templateUrl: './taxonomy-list.component.html',
  styleUrls: ['./taxonomy-list.component.scss']
})
export class TaxonomyListComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private addDialog: MatDialog,
    private popUpService: PopUpService,
    public apiService: ApiService,
  ) { }

  @Input() taxonomies;

  ngOnInit(): void {
  }

  sortByLevel(level: string, entities) {
    if (entities && entities.length > 0) {
      const arrayForSort = [...entities];
      switch (level) {
        case 'lvl_1':
          return arrayForSort.sort((a: any, b: any) => a.title.localeCompare(b.title));
        case 'lvl_2':
          return arrayForSort.sort((a: any, b: any) => a.title2.localeCompare(b.title2));
        case 'lvl_3':
          return arrayForSort.sort((a: any, b: any) => a.title3.localeCompare(b.title3));
        default:
          break;
      }
    }
  }

  update(level: string, taxonomy1: any, taxonomy2?: any, taxonomy3?: any) {

    let entity = null;
    switch (level) {
      case 'lvl_1':
        entity = { _id: taxonomy1._id, _subId: null, subLevel: level, title: taxonomy1.title };
        break;
      case 'lvl_2':
        entity = { _id: taxonomy1._id, _subId: taxonomy2._id2, subLevel: level, title: taxonomy1.title, title2: taxonomy2.title2, title3: null };
        break;
      case 'lvl_3':
        entity = { _id: taxonomy1._id, _subId: taxonomy3._id3, subLevel: level, title: taxonomy1.title, title2: taxonomy2.title2, title3: taxonomy3.title3 };
        break;
      default:
        break;
    }

    const ref = this.addDialog.open(TaxonomyUserTablePortalComponent, {
      width: '553px',
      height: '280px',
      maxWidth: undefined,
      panelClass: 'edit-user-table-modal',
      disableClose: false,
      data: { entity, mode: 'update', subLevel: level, entities: this.taxonomies, type: Types.Taxonomies, }
    });
    ref.afterClosed().subscribe(result => {
      this.popUpService.attachData({ success: false, type: '', items: null });
    });
  }

  create(level: string, taxonomy1: any, taxonomy2?: any, taxonomy3?: any) {
    let entity = null;
    switch (level) {
      case 'lvl_1':
        entity = { _id: null, _subId: null, subLevel: level, title: taxonomy1.title };
        break;
      case 'lvl_2':
        entity = { _id: taxonomy1._id, _subId: null, subLevel: level, title: taxonomy1.title, title2: taxonomy2.title2, title3: null };
        break;
      case 'lvl_3':
        entity = { _id: taxonomy1._id, _subId: taxonomy2._id2, subLevel: level, title: taxonomy1.title, title2: taxonomy2.title2, title3: taxonomy3.title3 };
        break;
      default:
        break;
    }

    // const entity = { _id: taxonomy1._id, _subId: taxonomy2?._id, subLevel: level, title: taxonomy1.title, title2: taxonomy2.title2, title3: taxonomy3.title3}

    const ref = this.addDialog.open(TaxonomyUserTablePortalComponent, {
      width: '650px',
      height: '620px',
      maxWidth: undefined,
      panelClass: 'edit-user-table-modal',
      disableClose: false,
      data: { entity, mode: 'create', subLevel: level, entities: this.taxonomies, type: Types.Taxonomies }
    });
    ref.afterClosed().subscribe(result => {
      this.popUpService.attachData({ success: false, type: '', items: null });
    });
  }

  remove(entity: any, parent, level) {
    let subId = null;
    if (level !== 'lvl_1') {
      subId = level === 'lvl_2' ? entity._id2 : entity._id3;
    }
    const name = this.getTitle(entity, level);
    entity = { mainParentId: parent._id, subEntity: subId, level };
    const ref = this.addDialog.open(DeleteUserTablePortalComponent, {
      width: '650px',
      height: '320px',
      maxWidth: undefined,
      panelClass: 'delete-user-table-modal',
      disableClose: false,
      data: { payload: entity, type: Types.Taxonomies, name }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const message = `Delete ${name} from taxonomies`;
        this.snackBar.open(message, 'success', {
          duration: 2000,
          panelClass: 'snckbar'
        });
        this.popUpService.attachData({ success: true, type: 'taxonomies', items: null });
      }
    });

    return this;
  }

  getTitle(entity: any, level: string) {
    switch (level) {
      case 'lvl_1':
        return entity.title;
      case 'lvl_2':
        return entity.title2;
      case 'lvl_3':
        return entity.title3;
      default:
        break;
    }
  }
}
