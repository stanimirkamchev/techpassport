import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpResponse  } from '@angular/common/http';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';

import { AddTeamMemberComponent } from '../../add-team-member-modal/add-team-member.component';
import { ApiService } from '@services/api/api.service';


export interface PocTeamManagerComponentData{
  teamData:any
}
export interface MemberElement {
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  myself: boolean;
  status: string;
  actions?: string;
  class: string;

};
@Component({
  selector: 'poc-team-manager',
  templateUrl: './poc-team-manager.component.html',
  styleUrls: ['./poc-team-manager.component.scss']
})
export class PocTeamManagerComponent implements OnInit {
  public teamData
 public teamList= [
    /*{
      id:'1',
      name:"Jakce",
      surname:"Black",
      email:"jblac@gmail.com"
    },
    {
      id:'2',
      name:"Robert",
      surname:"Cronenberg",
      email:"cronenber@wp.de"
    },
    {
      id:'3',
      name:"Jessica",
      surname:"Xander",
      email:"xanderjess@jet.zet"
    }*/
  ]
  constructor(
    public dialogRef: MatDialogRef<PocTeamManagerComponent>,
    private alertDialog: MatDialog,
    private apiService:ApiService,
    private addDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PocTeamManagerComponentData){
  }

  ngOnInit() {
    this.apiService.getSupplierTeam()
    .subscribe( (data: HttpResponse<Object>) => {
        this.teamData = [];
        for (let t of (data.body as any)){
          let memberElement : MemberElement = {
              id: t._id,
              name: t.name,
              email: t.email,
              role: t.role,
              status: t.status,
              class: t.status,
              myself: t.myself,
              group: t.group

          };
          this.teamData.push(memberElement);

        }
    }, (respError: Error) => {
        //console.log("getSupplierTeam error", respError);
    } )
  }
   remove(id,where): void {
      let ref = this.alertDialog.open(AlertModalComponent, {
        width: '300px',
        height: 'auto',
        disableClose: true,
        data: {title:"Are you sure you want to remove this user?", message:"", links: null, actions: [{label: "Yes", color:"warn"},{label: "No", color: "primary"}] }
      });
      ref.afterClosed().subscribe(result => {
        if (result === 'Yes'){
          let index = this[where].findIndex(x => x.id === id);

          if (index >= 0) {
            this[where].splice(index, 1);
          }
        }
      });



  }
  addMember() {
    this.addDialog.open(AddTeamMemberComponent, {
      width: '480px',
      height: '430px',
      maxWidth: undefined,
      panelClass:'add-member-modal',
      disableClose: false,
      data: {  }
    });
  }

}
