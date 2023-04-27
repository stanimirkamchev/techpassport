import { Injectable, NgZone } from '@angular/core';
import * as moment from 'moment';

import { CSVExporterProps, hasResolvables, isResolvable } from './csv-exporter';

@Injectable({
  providedIn: 'root'
})
export class CsvExporterService {

  constructor(private ngZone: NgZone) { }

  export<T>(rows: T[], props: CSVExporterProps<T>, filename = 'TechPassport export', timeFormat = 'YYYY MMM DD hh-mm a') {
    this.ngZone.runOutsideAngular(() => ((today: string, csvContent: string) => {
      csvContent += this.getHeader(props);
      csvContent += this.getRows(rows, props);
      (link => this.download(link, csvContent, `${filename} ${today}.csv`))(document.createElement('a'));
    })(moment().format(timeFormat), 'data:text/csv;charset=utf-8,'));
  }

  private getHeader<T>(props: CSVExporterProps<T>): string {
    let header = '';
    props.forEach((p, i) => header += ((hasResolvables(p) ? p[0] : p) + (i < props.length - 1 ? `,` : '')));
    return header;
  }

  private getRows<T>(rows: T[], props: CSVExporterProps<T>): string {
    let rows$ = '';
    rows.forEach(e => rows$ += '\r\n' + props.map(p => hasResolvables(p) ? (isResolvable(p[1]) ? p[1](e) : e[p[1]]) : e[p]).join(','));
    return rows$;
  }

  private download(link: HTMLAnchorElement, content: string, filename: string) {
    const escapedContent = content.replace(/\#/g, '') + '\r\n';
    link.setAttribute('href', encodeURI(escapedContent));
    link.setAttribute('download', filename);
    document.body.appendChild(link).click();
    setTimeout(() => link.remove(), 1000);
  }
}
