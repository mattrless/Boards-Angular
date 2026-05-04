import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInformationForm } from './card-information-form';

describe('CardInformationForm', () => {
  let component: CardInformationForm;
  let fixture: ComponentFixture<CardInformationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInformationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CardInformationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
