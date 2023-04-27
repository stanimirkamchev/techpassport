import { ErqBase } from './erq-base';
import { IRecoveryDTO } from './erq-dto';

export interface IRecovery {
  criticality: any;
  recoveryTime: number | string;
}

export class Recovery extends ErqBase<IRecovery> {

  constructor(payload: IRecoveryDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IRecoveryDTO): void {
    this.values = {
      criticality: payload?.criticality ?? null,
      recoveryTime: payload?.recoveryTime ?? null
    };
  }
}
