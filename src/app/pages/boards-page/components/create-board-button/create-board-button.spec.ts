import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoardButton } from './create-board-button';

describe('CreateBoardButton', () => {
  let component: CreateBoardButton;
  let fixture: ComponentFixture<CreateBoardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBoardButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
