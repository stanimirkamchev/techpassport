import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpResponse } from '@angular/common/http';
import { AddTeamMemberComponent } from '../add-team-member-modal/add-team-member.component';
import { AddBusinessGroupComponent } from '../add-business-group-component/add-business-group-component.component';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '@services/api/api.service';
import { Customer } from 'src/app/admin/store/customer/customer.model';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { getName } from 'country-list';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface MemberElement {
  position: number;
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  groupID?: string;
  businessGroup?: string;
  businessGroupID?: string;
  entity?: string;
  entityID?: string;
  myself: boolean;
  status: string;
  actions?: string;
  class: string;
  isSamlAuthenticated?: false;
  entityType?: string;

}
export interface GroupElement {
  _id: string;
  level: number;
  id: string;
  name: string;
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface BusinessElement {
  _id: string;
  name: string;
  entity: string;
  entityID: string;
  members: number;
}
export interface EntityElement {
  _id: string;
  name: string;
  country: string;
}
type samlType = {
  event: any, // Event
  element: Customer
};

const STATUS_ENUM = [
  { status: 'Active', label: 'active', class: 'active' },
  { status: 'Inactive', label: 'inactive', class: 'inactive' },
];


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})


export class TeamPageComponent implements OnInit {


  getName = getName;
  getUnicodeFlagIcon = getUnicodeFlagIcon;


  groups: GroupElement[] = [];
  teamData: MemberElement[] = [];
  businessData: BusinessElement[] = [];
  entitiesData: EntityElement[] = [];

  displayedColumns: string[];
  displayedColumnsBusinessGroups: string[];
  displayedColumnsEntities: string[];
  dataSource = new MatTableDataSource(this.teamData);
  dataSourceBusinessGroups = new MatTableDataSource(this.businessData);
  dataSourceEntities = new MatTableDataSource(this.entitiesData);
  portalType: string;
  allowTp = false;
  hideAllow = false;
  groupAllowed = false;
  allowInProgress = true;
  role: string;
  level: number;
  isCurrentUserSamlAuthenticated = false;

  entitiesGroupsSelection = new SelectionModel<EntityElement>(true, [], true);
  businessGroupsSelection = new SelectionModel<BusinessElement>(true, [], true);

  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

  // domain: string;

  constructor(
    private apiService: ApiService,
    private addDialog: MatDialog,
    private alertDialog: MatDialog,
    private socket: Socket,
    private store: Store<State>,
    private snackBar: MatSnackBar
  ) {

    this.portalType = apiService.sessionObject.type;
    this.role = apiService.sessionObject.role;
    this.level = apiService.sessionObject.level;
    if (this.portalType === 'customer') {
      this.hideAllow = true;
      this.groupAllowed = apiService.sessionObject.level <= 2;
    } else {
      this.checkTpAccess();
    }

    if (this.portalType === 'supplier') {
      this.displayedColumns = ['avatar', 'name', 'email', 'role', 'status', 'actions'];
    } else {
      this.displayedColumns = ['avatar', 'name', 'email', 'group', 'entity', 'businessGroup', 'status', 'isSamlAuthenticated', 'actions'];
      if (this.level > 1) {
        this.displayedColumns = this.displayedColumns.filter(a => a !== 'isSamlAuthenticated');
      }

      this.displayedColumnsBusinessGroups = ['avatar', 'name', 'entity', 'members', 'status', 'actions'];
      this.displayedColumnsEntities = ['avatar', 'name', 'country', 'status', 'actions'];
      this.getEntieties();
      this.getBusinessGroups();
      this.entitiesGroupsSelection.changed.subscribe(change => {
        this.entitySelectionChanged();
      });
      this.businessGroupsSelection.changed.subscribe(change => {
        this.businessSelectionChanged();
      });
    }
    this.socket.on('new-member', (event) => {
      this.getSupplierTeam();
    });
    this.getSupplierTeam();
  }
  ngOnInit() {

  }
  entitySelectionChanged() {
    if (this.isAllSelected(this.entitiesGroupsSelection, this.dataSourceEntities)) {
      this.dataSourceBusinessGroups.data = this.businessData;
    }
    else {
      this.dataSourceBusinessGroups.data = this.businessData.filter(x => {
        return this.entitiesGroupsSelection.selected.find(y => y._id === x.entityID);
      });
    }
    this.businessSelectionChanged(this.dataSourceBusinessGroups.data);
  }
  businessSelectionChanged(dt?) {
    let selected;
    if (dt) {
      selected = dt;
    }
    else {
      if (this.isAllSelected(this.businessGroupsSelection, this.dataSourceBusinessGroups) && this.isAllSelected(this.entitiesGroupsSelection, this.dataSourceEntities)) {
        this.dataSource.data = this.teamData;
        return;
      } else {
        selected = this.businessGroupsSelection.selected;
      }
    }
    this.dataSource.data = this.teamData.filter(x => {
      return selected.find(y => y._id === x.businessGroupID);
    });
  }
  getEntieties() {
    this.apiService.getEntieties().subscribe((data: HttpResponse<Object>) => {
      this.entitiesData = data as any;
      this.dataSourceEntities = new MatTableDataSource(this.entitiesData);
    }, (respError: Error) => {

    });
  }

  getBusinessGroups() {
    this.apiService.getBusinessGroups().subscribe((data: HttpResponse<Object>) => {
      this.businessData = data as any;
      this.dataSourceBusinessGroups = new MatTableDataSource(this.businessData);
    }, (respError: Error) => {

    });
  }

  getEntity(member) {
    return this.businessData.find(x => x._id === member.businessGroupID)?.entity;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeSAML(event, element) {
    console.log(event, element);
    const id = element._id;
    const member = { ...element, isSamlAuthenticated: element.isSamlAuthenticated ? event.checked : false };
    this.apiService.updateTeamSAML(id, member).subscribe();
    this.openSnackBar(element.name, event.checked);
  }

  openSnackBar(name: string, state: any) {
    const message = `You have changed authentication status of ${name} to ${state}`;
    this.snackBar.open(message, 'success', {
      duration: 2000,
      panelClass: 'snckbar'
    });
  }


  isAllSelected(selection, dataSource) {
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows || selection.selected.length === 0;
  }

  resetFilters() {
    this.applyFilter('');
    this.filterInput.nativeElement.value = null;
    this.entitiesGroupsSelection.clear();
    this.businessGroupsSelection.clear();
  }

  grantAccess(allow: boolean) {
    this.allowInProgress = true;
    this.apiService.grantTpAccess(allow).subscribe((data: HttpResponse<Object>) => {
      this.allowTp = (data.body as any).allow;
      this.allowInProgress = false;
    }, (respError: Error) => {
      this.allowInProgress = false;
    });
  }
  addMember() {
    const ref = this.addDialog.open(AddTeamMemberComponent, {
      width: '495px',
      height: '480px',
      maxWidth: undefined,
      panelClass: 'add-member-modal',
      disableClose: false,
      data: {
        groups: this.groups,
        role: this.apiService.sessionObject.role,
        teamType: this.portalType,
        businessGroups: this.businessData,
        entities: this.entitiesData,
        createNew: true,
        isCurrentUserSamlAuthenticated: this.isCurrentUserSamlAuthenticated,
        level: this.apiService.sessionObject.level
      }
    });
    ref.afterClosed().subscribe(result => {
      this.getSupplierTeam();
    });
  }

  addGroup() {
    const ref = this.addDialog.open(AddBusinessGroupComponent, {
      width: '495px',
      height: '400px',
      maxWidth: undefined,
      panelClass: 'add-member-modal',
      disableClose: false,
      data: { groups: this.groups, teamType: this.portalType }
    });
    ref.afterClosed().subscribe(result => {
      this.getBusinessGroups();
    });

  }

  updateBusinessGroup(group) {
    const ref = this.addDialog.open(AddBusinessGroupComponent, {
      width: '495px',
      height: '400px',
      maxWidth: undefined,
      panelClass: 'add-member-modal',
      disableClose: false,
      data: { groups: this.groups, teamType: this.portalType, element: group }
    });
    ref.afterClosed().subscribe(result => {
      this.getBusinessGroups();
    });
  }

  removeBusinessGroup(group) {
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '300px',
      height: '265px',
      disableClose: true,
      data: { title: `Are you sure you want delete ${group.name}?`, message: '', links: null, actions: [{ label: 'Yes', color: 'warn' }, { label: 'No', color: 'primary' }] }
    });
    ref.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.apiService.deleteBusinessGroups(group._id)
          .subscribe((data: HttpResponse<Object>) => {
            this.getBusinessGroups();
          }, (respError: Error) => {

          });
      }
    });

  }

  removeMember(member) {
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '300px',
      height: '265px',
      disableClose: true,
      data: { title: `Are you sure you want delete ${member.name}?`, message: '', links: null, actions: [{ label: 'Yes', color: 'warn' }, { label: 'No', color: 'primary' }] }
    });
    ref.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.apiService.supplierTeamRemove(member.id)
          .subscribe((data: HttpResponse<Object>) => {
          }, (respError: Error) => {
            member.reinvited = false;
          });
      }
    });


  }
  async resendInvitation(member) {
    member.reinvited = true;
    //
    this.apiService.supplierTeamReInvite({ id: member.id }).subscribe((data: HttpResponse<Object>) => {

    }, (respError: Error) => {
      member.reinvited = false;
    });
  }
  editRole(member) {
    const ref = this.addDialog.open(AddTeamMemberComponent, {
      width: '495px',
      height: '480px',
      maxWidth: undefined,
      panelClass: 'add-member-modal',
      disableClose: false,
      data: {
        groups: this.groups,
        role: this.apiService.sessionObject.role,
        teamType: this.portalType,
        businessGroups: this.businessData,
        entities: this.entitiesData,
        member,
        isSamlAuthenticated: member.isSamlAuthenticated,
        class: member.class,
        createNew: false,
        isCurrentUserSamlAuthenticated: this.isCurrentUserSamlAuthenticated,
        level: this.apiService.sessionObject.level
      }
    });
    ref.afterClosed().subscribe(result => {
      this.getSupplierTeam();
    });
  }

  checkTpAccess() {


    this.apiService.getTpAccess().subscribe((gData: HttpResponse<Object>) => {
      //
      this.allowTp = (gData.body as any)?.allow;
      this.allowInProgress = false;
    }, (respError: Error) => {
      this.allowInProgress = false;
    });
  }

  getSupplierTeam() {


    this.apiService.getTeamGroups().subscribe((gData: HttpResponse<Object>) => {
      //
      for (const g of (gData.body as any)) {
        const grElement: GroupElement = {
          id: g._id,
          _id: g._id, /// Migration ^^
          level: g.level,
          name: g.name,
        };
        this.groups.push(grElement);
      }

      this.apiService.getSupplierTeam()
        .subscribe((data: HttpResponse<Object>) => {
          this.teamData = [];

          for (const t of (data.body as any)) {
            const memberElement: MemberElement = {
              position: this.dataSource.filteredData.length + 1,
              _id: t._id,
              id: t._id, // Migration ^
              name: t.name,
              email: t.email,
              role: t.role,
              status: t.status,
              class: t.status,
              myself: t.myself,
              group: t.group,
              groupID: t.group,
              businessGroup: '',
              businessGroupID: t.businessGroup,
              entityType: t.entityType,
              entity: t.entity,
              isSamlAuthenticated: t.isSamlAuthenticated ? t.isSamlAuthenticated : false
            };
            if (t.myself) {
              this.isCurrentUserSamlAuthenticated = t.isSamlAuthenticated;
            }
            for (const g of this.groups) {
              if (g._id === memberElement.groupID) {
                memberElement.group = g.name;
              }
            }
            for (const g of this.businessData) {
              if (g._id === memberElement.businessGroupID) {
                memberElement.businessGroup = g.name;
              }
            }

            this.teamData.push(memberElement);

          }
          this.dataSource = new MatTableDataSource(this.teamData);
        }, (respError: Error) => {
          // console.log("getSupplierTeam error", respError);
        });
    }, (respError: Error) => { });
  }


}
