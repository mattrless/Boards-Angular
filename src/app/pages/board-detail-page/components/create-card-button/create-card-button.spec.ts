import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardButton } from './create-card-button';

describe('CreateCardButton', () => {
  let component: CreateCardButton;
  let fixture: ComponentFixture<CreateCardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCardButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
