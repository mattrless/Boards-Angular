import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFields(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const field1 = group.get(controlName);
    const field2 = group.get(matchingControlName);

    if (!field1 || !field2) return null;

    const fieldsMatch = field1.value === field2.value;

    if (!fieldsMatch) {
      // setting error in second field
      field2.setErrors({ fieldsMismatch: true });
      return null;
    }

    // clear fieldsMismatch error when match but leave the rest of them
    const { fieldsMismatch, ...remainingErrors } = field2.errors ?? {};
    const hasErrors = Object.keys(remainingErrors).length > 0;
    field2.setErrors(hasErrors ? remainingErrors : null);

    return null;
  };
}
