import { AbstractControl, ValidationErrors } from '@angular/forms';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || control.value.trim() === '') return null;

  try {
    const url = new URL(control.value);
    const extension = url.pathname.split('.').pop()?.toLowerCase();
    return IMAGE_EXTENSIONS.includes(extension ?? '')
      ? null
      : { invalidImageUrl: true };
  } catch {
    return { invalidUrl: true };
  }
}
