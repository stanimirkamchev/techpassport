import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {

    public editDataDetails: { success: boolean | any, type?: string, items: any[] } = { success: null,  type: '', items: [] };

    private _popUpServiceSource = new BehaviorSubject(this.editDataDetails);
    public readonly popUpOverview: Observable<{ success: boolean, type?: string, items: any[] }> = this._popUpServiceSource.asObservable();

    constructor() {
    }

    attachData(items: { success: boolean, type?: string, items: any[] }): void {
        this._popUpServiceSource.next(items);
    }
}