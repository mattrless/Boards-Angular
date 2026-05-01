import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardForm } from './create-card-form';

describe('CreateCardForm', () => {
  let component: CreateCardForm;
  let fixture: ComponentFixture<CreateCardForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCardForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCardForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
