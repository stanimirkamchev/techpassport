import { InvitationFilter, InvitationFilterPreview, InvitationStatus, InvitationType, InvitationUserType, InviteSuppliersTableModel } from '../invite-suppliers.model';

export class InvitationFilterService {

  static setFilterPreview(data: InviteSuppliersTableModel[]): InvitationFilterPreview {
    return {
      status: [...new Set(data.map((tbl: InviteSuppliersTableModel) => tbl.status))],
      type: [...new Set(data.map((tbl: InviteSuppliersTableModel) => tbl.recordType))],
      userType: [
        ...new Set(data.map((tbl: InviteSuppliersTableModel) => tbl.entityMember.group.name)),
        ...[...new Set(data.map((tbl: InviteSuppliersTableModel) => tbl.entityMember.role))].filter((role: string) => role === InvitationUserType.OWNER)],
      company: [...new Set(data.map((tbl: InviteSuppliersTableModel) => tbl.customer.name))],
      emailAddress: [...new Set(data.map((tbl: InviteSuppliersTableModel) => `${tbl.user.firstName} ${tbl.user.lastName}`))],
    };
  }

  static getFilteredData(filter: InvitationFilter, allData: InviteSuppliersTableModel[]): InviteSuppliersTableModel[] {

    if (filter.status !== InvitationStatus.ALL) {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => tbl.status === filter.status);
    }

    if (filter.type !== InvitationType.ALL) {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => tbl.recordType === filter.type);
    }

    if (filter.userType !== InvitationUserType.ALL) {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => {
        if (filter.userType === InvitationUserType.OWNER) {
          return tbl.entityMember.role === filter.userType;
        } else {
          return tbl.entityMember.group.name === filter.userType;
        }
      });
    }

    if (filter.company !== 'all') {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => tbl.customer.name === filter.company);
    }

    if (filter.emailAddress !== 'all') {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => `${tbl.user.firstName} ${tbl.user.lastName}` === filter.emailAddress);
    }

    if (filter.dateFrom) {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => new Date(tbl.createdAt).getTime() >= new Date(filter.dateFrom).getTime());
    }

    if (filter.dateTo) {
      allData = allData.filter((tbl: InviteSuppliersTableModel) => new Date(tbl.createdAt).getTime() <= new Date(filter.dateTo).getTime());
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      allData = allData.filter((tbl: InviteSuppliersTableModel) => {
        return (tbl.status.toLowerCase().includes(search)) ||
          (tbl.user.email.toLowerCase().includes(search)) ||
          (tbl.userNote && tbl.userNote.toLowerCase().includes(search)) ||
          (tbl.tppNote && tbl.tppNote.toLowerCase().includes(search)) ||
          (tbl.createdAt.toString().includes(search)) ||
          (tbl.receiver.toLowerCase().includes(search));
      });
    }

    // TODO: sort desc by createdAt

    return [...allData];
  }
}
