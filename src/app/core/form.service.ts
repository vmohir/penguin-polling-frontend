import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor() {}
  validateAllFormFields(formGroup: FormGroup | FormArray) {
    const keysArray = formGroup instanceof FormGroup ? Object.values(formGroup.controls) : formGroup.controls;
    keysArray.forEach(control => {
      if (control instanceof FormControl) {
        if (control.value === '') control.setValue(null);
        control.markAsTouched({ onlySelf: false });
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }
  validateForm(formGroup: FormGroup | FormArray): boolean {
    // console.log("​FormService -> constructor -> formGroup", formGroup)
    this.validateAllFormFields(formGroup);
    if (formGroup.invalid) {
      return false;
    }
    return true;
  }
}
