import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'answerIndicator'
})
export class AnswerIndicatorPipe implements PipeTransform {

  constructor() {}

  transform(value: string): any {
    if (value === 'yes') {
      return '<span class="positive">&#10003;</span>';
    }
    else if (value === 'no') {
      return '<span class="negative">&#10006;</span>';
    }
    return value || '&ndash;';
  }

}
