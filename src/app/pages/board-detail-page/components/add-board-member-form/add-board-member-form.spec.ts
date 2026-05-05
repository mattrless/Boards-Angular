import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardMemberForm } from './add-board-member-form';

describe('AddBoardMemberForm', () => {
  let component: AddBoardMemberForm;
  let fixture: ComponentFixture<AddBoardMemberForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoardMemberForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBoardMemberForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
