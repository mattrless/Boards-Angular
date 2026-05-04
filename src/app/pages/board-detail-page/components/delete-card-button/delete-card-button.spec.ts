import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCardButton } from './delete-card-button';

describe('DeleteCardButton', () => {
  let component: DeleteCardButton;
  let fixture: ComponentFixture<DeleteCardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCardButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
