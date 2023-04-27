import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { PopUpService } from '../../shared/pop-up-service';

import { State } from '../../admin/store/editTables/editTables.reducer';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'taxonomy-user-table-portal',
  templateUrl: './taxonomy-user-table-portal.component.html',
  styleUrls: ['./taxonomy-user-table-portal.component.scss']
})

export class TaxonomyUserTablePortalComponent implements OnInit {
  constructor(
    public apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaxonomyUserTablePortalComponent>,
    private store: Store<State>,
    private popUpService: PopUpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  title = '';
  title1Text = '';
  title2Text = '';
  title3Text = '';
  entity: any;
  entities: any;
  type = 'taxonomies';
  inputtedText = '';
  mode: string;
  error = false;
  subLevel: string;

  ngOnInit(): void {
    this.entities = this.data.entities;
    this.entity = this.data.entity;
    this.mode = this.data.mode;
    this.subLevel = this.data.subLevel;


    this.title = this.mode === 'create' ? 'Add Taxonomy' : 'Amend Taxonomy';
    this.title1Text = this.entity ? this.entity.title : null;

    if (this.subLevel === 'lvl_1' && this.mode === 'create') {
      this.title1Text = null;
    } else {
      this.title2Text = this.entity ? this.entity.title : null;
    }
    if (this.subLevel === 'lvl_2' && this.mode === 'create') {
      this.title2Text = null;
    } else {
      this.title2Text = this.entity ? this.entity.title2 : null;
    }
    this.title3Text = null;
    this.inputtedText = this.getProperTitleByLevel();
  }

  getProperTitleByLevel() {
    if (this.entity) {
      switch (this.subLevel) {
        case 'lvl_1':
          return this.entity.title;
        case 'lvl_2':
          return this.entity.title2;
        case 'lvl_3':
          return this.entity.title3;
      }
    }
  }

  onChangeText() {
    this.error = false;
  }

  cancel() {
    this.dialogRef.close();
  }

  errorTextByLevel() {
    if (this.entities && this.entities.length > 0) {
      if (this.mode === 'create') {
        switch (this.subLevel) {
          case 'lvl_1':
            return this.entities.find(item => item.title.toLocaleLowerCase().trim() === this.title1Text.toLowerCase().trim()) ? true : false;
          case 'lvl_2':
            const gr1 = this.entities.find(lvl1 => lvl1.title === this.entity.title);
            if (!gr1) {
              return false;
            }
            return gr1.level2.find((lvl2: any) => {
              return lvl2.title2.toLocaleLowerCase().trim() === this.title2Text.toLowerCase().trim();
            });
          case 'lvl_3':
            return this.entities.some((item: any) => {
              const gr2 = item.level2.find(lvl2 => lvl2.title2 === this.entity.title2);
              if (gr2) {
                return gr2.level3.find((lvl3: any) => {
                  return lvl3.title3.toLocaleLowerCase().trim() === this.title3Text.toLowerCase().trim();
                });
              }
            }) ? true : false;
        }
      } else {
        switch (this.subLevel) {
          case 'lvl_1':
            return this.entities.find(item => item.title.toLocaleLowerCase().trim() === this.inputtedText.toLowerCase().trim()) ? true : false;
          case 'lvl_2':
            const gr1 = this.entities.find(lvl1 => lvl1.title === this.entity.title);
            if (!gr1) {
              return false;
            }
            return gr1.level2.find((lvl2: any) => {
              return lvl2.title2.toLocaleLowerCase().trim() === this.inputtedText.toLowerCase().trim();
            });
          case 'lvl_3':
            return this.entities.some((item: any) => {
              const gr2 = item.level2.find(lvl2 => lvl2.title2 === this.entity.title2);
              if (gr2) {
                return gr2.level3.find((lvl3: any) => {
                  return lvl3.title3.toLocaleLowerCase().trim() === this.inputtedText.toLowerCase().trim();
                });
              }
            }) ? true : false;
        }
      }
    }
  }

  update() {
    this.error = this.errorTextByLevel();

    if (!this.error) {
      const payload = { _id: null, _subId: null, name: this.inputtedText, subLevel: this.subLevel };
      if (this.subLevel === 'lvl_1') {
        payload._id = this.entity._id;
      }
      else if (this.subLevel === 'lvl_2') {
        payload._id = this.entity._id;
        payload._subId = this.entity._subId;
      }
      else if (this.subLevel === 'lvl_3') {
        payload._id = this.entity._id;
        payload._subId = this.entity._subId;
      }

      payload.name = this.inputtedText;
      payload.subLevel = this.subLevel;

      this.apiService.adminUpdateTable(this.type, payload).subscribe(
        (data: HttpResponse<any>) => {
          const message = `Update ${this.entity.name} from ${this.type.toUpperCase()}`;
          this.snackBar.open(message, 'success', {
            duration: 2000,
            panelClass: 'snackbar'
          });

          this.popUpService.attachData({ success: true, type: this.type, items: null });
        },
        (respError: Error) => {
        }
      );
      this.cancel();
    }
  }

  create() {
    this.error = this.errorTextByLevel();

    if (!this.error) {

      const payload = this.entity ?
        { _id: this.entity._id, _subId: this.entity._subId, subLevel: this.subLevel, title: this.title1Text, title2: this.title2Text, title3: this.title3Text }
        : { _id: null, _subId: null, subLevel: 'lvl_1', title: this.title1Text, title2: this.title2Text, title3: this.title3Text };

      this.apiService.adminCreateTable(this.type, payload).subscribe(
        (data: HttpResponse<any>) => {
          const message = `Added new taxonomy`;
          this.snackBar.open(message, 'success', {
            duration: 2000,
            panelClass: 'snackbar'
          });

          this.popUpService.attachData({ success: true, type: this.type, items: null });
        },
        (respError: Error) => {
        }
      );

      this.cancel();
    }
  }

  opacity() {
    if (this.mode === 'create') {
      return this.title1Text && this.title1Text.length >= 1 && this.title2Text && this.title2Text.length >= 1 && this.title3Text && this.title3Text.length >= 1;
    } else {
      return this.inputtedText && this.inputtedText.length >= 1;
    }
  }

  disabled() {
    if (this.mode === 'create') {
      return this.title1Text && this.title1Text.length <= 1 && this.title2Text && this.title2Text.length <= 1 && this.title3Text && this.title3Text.length <= 1;
    } else {
      return this.inputtedText && this.inputtedText.length <= 1;
    }
  }
}
