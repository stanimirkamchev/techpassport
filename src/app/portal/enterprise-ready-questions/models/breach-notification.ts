import { ErqBase } from './erq-base';
import { IBreachNotificationDTO } from './erq-dto';

export interface IBreachNotification {
  breachNotification: boolean;
}

export class BreachNotification extends ErqBase<IBreachNotification> {
  constructor(payload: IBreachNotificationDTO) {
    super();
    this.populate(payload);
  }

  protected populate(payload: IBreachNotificationDTO): void {
    this.values = {
      breachNotification: payload?.breachNotification ?? null
    };
  }
}
