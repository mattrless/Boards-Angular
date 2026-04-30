import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListForm } from './edit-list-form';

describe('EditListForm', () => {
  let component: EditListForm;
  let fixture: ComponentFixture<EditListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditListForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EditListForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
