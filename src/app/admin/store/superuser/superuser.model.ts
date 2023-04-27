import { Identifiable } from '@abstract/identifiable';
import { FilterBase } from '@models/filters';
import { FilterAbstract } from '@abstract/filterable';
import { Type } from '@angular/core';

export enum UserRole {
  admin, superadmin, member, none
}

export interface UserDTO {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// AccessManagement
export enum AccessManagementStatus {
  ACTIVE = 'Active'
}

export enum AccessManagementUserRole {
  ADMIN = 'Admin'
}

export enum AccessManagementUserType {
  BUYER = 'Buyer',
  SUPPLIER = 'Supplier'
}

export enum AccessManagementStatus {
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface AccessManagement extends Identifiable {
  displayName: string;
  email: string;
  phone: string;
  role: AccessManagementUserRole;
  createdAt: Date;
  accessDuration: number;
  lastAccessed: Date;
  connectionsInProgress: number;
  connectionsCompleted: number;
  type: AccessManagementUserType;
  company: string;
  companyCountry: string;
  status: AccessUserStatus;
}

export interface AccessManagementFilters extends FilterBase {
  role?: string;
  type?: string;
  company?: string;
}

export class AccessManagementBuilder extends FilterAbstract<AccessManagement, AccessManagementFilters> {

  constructor(accessManagement: AccessManagement[]) {
    super(accessManagement);
  }

  filter(filters: AccessManagementFilters): AccessManagementBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i.displayName + i.company)
          .toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      if (filters.company) {
        matched = matched && i.company === filters.company;
      }
      if (filters.role) {
        matched = matched && i.role === filters.role;
      }
      if (filters.type) {
        matched = matched && i.type === filters.type;
      }
      return matched;
    });
    return this;
  }

  deleteUser(id: string): AccessManagementBuilder {
    this.items = this.items.filter(i => i._id !== id);
    return this;
  }

  unlockUser(id: string): AccessManagementBuilder {
    this.items = this.items.map(item => ({
      ...item,
      status: item._id === id ? 'active' as AccessUserStatus.active : item.status
    }));
    return this;
  }

  lockUser(id: string): AccessManagementBuilder {
    this.items = this.items.map(item => ({
      ...item,
      status: item._id === id ? 'locked' as AccessUserStatus.locked : item.status
    }));
    return this;
  }
}


// ErrorHandling
export interface ErrorHandling extends Identifiable {
  date: string;
  errorId: string;
  level: number;
  type: string;
  details: string;
}

export interface ErrorHandlingFilters extends FilterBase {
  type: string;
}

export enum ErrorHandlingType {
  type = 'Type'
}

export class ErrorHandlingBuilder extends FilterAbstract<ErrorHandling, ErrorHandlingFilters> {

  constructor(accessManagement: ErrorHandling[]) {
    super(accessManagement);
  }

  filter(filters: ErrorHandlingFilters): ErrorHandlingBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i._id)
          .toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      return matched;
    });
    return this;
  }
}

//
// AccessLog
//
export interface AccessLog extends Identifiable {
  user: AccessLogUser;
  accessDate: Date;
  accessDuration: number;
  activeSession: boolean;
  status: AccessLogStatus;
  clientAgent: string;
  clientIP: string;
  clientReferer: string;
  isSamlAuthenticated?: boolean
}

export interface AccessLogUser extends Identifiable {
  firstName: string;
  lastName: string;
  email: string;
  status: AccessUserStatus;
  displayName: string;
  entityType: string;
  company: string;
}

export enum AccessLogStatus {
  Offline = 'Offline',
  Online = 'Online'
}

export enum AccessUserStatus {
  inactive = 'Inactive',
  active = 'Active',
  locked = 'Locked'
}

export interface AccessLogFilters extends FilterBase {
  displayName?: string;
  userStatus?: string;
  companyName?: string;
  sessionStatus?: string;
  email?: string;
}

export class AccessLogBuilder extends FilterAbstract<AccessLog, AccessLogFilters> {

  constructor(accessManagement: AccessLog[]) {
    super(accessManagement);
  }

  filter(filters: AccessLogFilters): AccessLogBuilder {
    this.items = this.items.filter(i => {
      let matched = true;
      if (filters.search) {
        matched = matched && (i._id + i.user.displayName)
          .toLowerCase().indexOf(filters.search.toLowerCase()) > -1;
      }
      if (filters.displayName) {
        matched = matched && i.user.displayName === filters.displayName;
      }
      if (filters.companyName) {
        matched = matched && i.user.company === filters.companyName;
      }
      if (filters.userStatus) {
        matched = matched && i.user.status === filters.userStatus;
      }
      if (filters.sessionStatus) {
        matched = matched && i.status === filters.sessionStatus;
      }
      if (filters.email) {
        matched = matched && i.user.email === filters.email;
      }
      return matched;
    });
    return this;
  }

  /** @todo create @Chainable decorator */
  unlockUser(id: string): AccessLogBuilder {
    this.items = this.items.map(item => ({
      ...item,
      user: {
        ...item.user,
        status: item.user._id === id ? 'active' as AccessUserStatus.active : item.user.status
      }
    }));
    return this;
  }

  lockUser(id: string): AccessLogBuilder {
    this.items = this.items.map(item => ({
      ...item,
      user: {
        ...item.user,
        status: item.user._id === id ? 'locked' as AccessUserStatus.locked : item.user.status
      }
    }));
    return this;
  }

  deleteUser(id: string): AccessLogBuilder {
    this.items = this.items.filter(i => i.user._id !== id);
    return this;
  }
}
