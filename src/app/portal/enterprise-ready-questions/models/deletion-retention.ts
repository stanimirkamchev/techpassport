import { ErqBase } from './erq-base';
import { IDeletionRetentionDTO } from './erq-dto';

export interface MaintainMultipleCopiesOfData {
  yes: boolean;
  no: boolean;
}

export interface IDeletionRetention {
  deleteAbility: boolean;
  provideACopy: boolean;
  currentProcessExplanationOfDeletingCustomersData: string | null;
  currentProcessExplanationOfCopyingCustomersData: string | null;
  maintainMultipleCopiesOfData: MaintainMultipleCopiesOfData;
}

export class DeletionRetention extends ErqBase<IDeletionRetention> {

  constructor(payload: IDeletionRetentionDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IDeletionRetentionDTO): void {
    this.values = {
      deleteAbility: payload?.deleteAbility ?? null,
      provideACopy: payload?.provideACopy ?? null,
      currentProcessExplanationOfDeletingCustomersData: payload?.currentProcessExplanationOfDeletingCustomersData ?? null,
      currentProcessExplanationOfCopyingCustomersData: payload?.currentProcessExplanationOfCopyingCustomersData ?? null,
      maintainMultipleCopiesOfData: {
        yes: payload?.yes ?? null,
        no: payload?.no ?? null
      }
    };
  }
}
