import { IErqDto } from './erq-dto';

export abstract class ErqBase<T> {
  protected values: T;

  get data(): T {
    return this.values;
  }

  protected abstract populate(payload: IErqDto | any): void;
}
