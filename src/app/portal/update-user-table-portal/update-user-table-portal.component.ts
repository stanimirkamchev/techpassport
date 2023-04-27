import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpService } from '../../shared/pop-up-service';

export enum Types {
  Tags = 'tags',
  Frameworks = 'frameworks',
  Solutions = 'solutions',
}

@Component({
  selector: 'update-user-table-portal',
  templateUrl: './update-user-table-portal.component.html',
  styleUrls: ['./update-user-table-portal.component.scss']
})
export class UpdateUserTablePortalComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateUserTablePortalComponent>,
    private popUpService: PopUpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  title = ''
  entity: any
  entities: any
  type: string
  inputtedText = ''
  inputtedTypeText = ''
  inputtedNameText = ''
  mode: string
  typeText: string
  error = false
  subLevel: string

  ngOnInit(): void {
    this.entities = this.data.entities
    this.entity = this.data.entity
    this.type = this.data.type
    this.mode = this.data.mode
    this.subLevel = this.data.subLevel

    switch(this.type) {
      case Types.Tags:
        this.typeText = 'tag'
        break;
      case Types.Frameworks:
        this.typeText = 'framework'
        break;
      case Types.Solutions:
          this.typeText = 'solution'
          break;
    }

    this.title = this.mode == 'create' ? `Add a new ${this.typeText}` : `Amend ${this.typeText}`
    if(this.entity && this.mode == 'update') {
      this.inputtedText = this.subLevel == 'type' ? this.entity.key : this.entity.name
    }

  }

  onChangeText() {
    this.error = false
  }

  cancel() {
    this.dialogRef.close();
  }

  update() {
    this.error = this.subLevel == 'type' ?
        this.entities.find(item => item.key.toLocaleLowerCase().trim() == this.inputtedText.toLowerCase().trim() ) ? true : false
      : this.entities.find(item => item.name.toLocaleLowerCase().trim() == this.inputtedText.toLowerCase().trim() ) ? true : false

    if(!this.error) {
      this.entity = this.subLevel == 'type' ?
        { _id: null, type: this.entity.key, name: null, newType: this.inputtedText, subLevel: this.subLevel }
      : { ...this.entity, name: this.inputtedText, newType: null, subLevel: this.subLevel }

      this.apiService.adminUpdateTable(this.type, this.entity).subscribe(
        (data: HttpResponse<any>) => {
          const message = `Update ${this.subLevel ? this.entity.key : this.entity.name} from ${this.type.toUpperCase()}`
          this.snackBar.open(message, 'success', { duration: 2000, panelClass: 'snackbar' })
          this.popUpService.attachData({ success: true, type: this.type, items: null });
        },
        (respError: Error) => {
          this.snackBar.open('There is a problem', 'danger', { duration: 2000, panelClass: 'snackbar' })
        }
      )
      this.cancel()
    }
  }

  create() {
    this.error = this.entities && this.entities.length > 0 ? this.subLevel == 'type' ?
                    this.entities.find(item => item.key.toLocaleLowerCase().trim() == this.inputtedText.toLowerCase().trim()) ? true : false
                    : this.entities.find(item => item.name.toLocaleLowerCase().trim() == this.inputtedText.toLowerCase().trim() ) ? true : false
                  : false

    if(!this.error) {

      if(this.type == 'solutions') {
        this.entity =  this.subLevel == 'type' ?
          { name: this.inputtedNameText, type: this.inputtedTypeText, newType: null, subLevel: 'type' }
        : { name: this.inputtedText, type: this.entity.type, newType: null, subLevel: 'name' }
      } else {
        this.entity = { name: this.inputtedText }
      }

      this.apiService.adminCreateTable(this.type, this.entity).subscribe(
        (data: HttpResponse<any>) => {
          const message = `Add ${this.entity.name} from ${this.type.toUpperCase()}`
          this.snackBar.open(message, 'success', {
            duration: 2000,
            panelClass: 'snackbar'
          })

          this.popUpService.attachData({ success: true, type: this.type, items: null });
        },
        (respError: Error) => {
          this.snackBar.open('There is a problem', 'danger', { duration: 2000, panelClass: 'snackbar' })
        }
      )

      this.cancel()
    }
  }

  disabled() {
    if(this.subLevel == 'type') {
      if(this.mode == 'create') {
        return this.inputtedNameText && this.inputtedNameText.length <= 1 && this.inputtedTypeText && this.inputtedTypeText.length <= 1
      } else {
        return this.inputtedText && this.inputtedText.length <= 1
      }
    } else {
      return this.inputtedText && this.inputtedText.length <= 1
    }
  }

  opacity() {
    if(this.subLevel == 'type') {
      if(this.mode == 'create') {
        return this.inputtedNameText && this.inputtedNameText.length >= 1 && this.inputtedTypeText && this.inputtedTypeText.length >= 1
      } else {
        return this.inputtedText && this.inputtedText.length >= 1
      }

    } else {
      return this.inputtedText && this.inputtedText.length >= 1
    }
  }

}
