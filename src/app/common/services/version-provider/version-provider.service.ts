import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionProviderService {

  constructor() { }

  static getVersion(): string {
    return environment.version;
  }

  getVersion(): Observable<string> {
    return of(environment.version);
  }
}
