import { ErqBase } from './erq-base';
import { ISsdlcDTO } from './erq-dto';

export interface ISsdlc {
  penetrationTestCovering: boolean;
}

export class Ssdlc extends ErqBase<ISsdlc> {

  constructor(payload: ISsdlcDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: ISsdlcDTO): void {
    this.values = {
      penetrationTestCovering: payload?.penetrationTestCovering ?? null
    };
  }
}
