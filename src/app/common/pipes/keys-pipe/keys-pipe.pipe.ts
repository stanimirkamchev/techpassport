import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keysPipe'
})
export class KeysPipe implements PipeTransform {
  transform(value: any): string[] {
    return Object.keys(value)
  }
}
