import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListForm } from './create-list-form';

describe('CreateListForm', () => {
  let component: CreateListForm;
  let fixture: ComponentFixture<CreateListForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateListForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateListForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
