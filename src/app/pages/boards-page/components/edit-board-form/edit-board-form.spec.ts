import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoardForm } from './edit-board-form';

describe('EditBoardForm', () => {
  let component: EditBoardForm;
  let fixture: ComponentFixture<EditBoardForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBoardForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBoardForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
