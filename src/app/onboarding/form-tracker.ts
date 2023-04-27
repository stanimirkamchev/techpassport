import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FormTracker {
  data = {} as any

  constructor(
  ) {
  }

  tracking(name, controlName, value) {
    if(!this.data[name]) {
      this.data[name]= {}
    }
    this.data[name][controlName] = value
  }

  isValid(name) {
    return Object.entries(this.data[name]).every(t => t[1])
  }
}
