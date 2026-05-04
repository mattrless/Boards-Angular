import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLeaveCardButton } from './join-leave-card-button';

describe('JoinLeaveCardButton', () => {
  let component: JoinLeaveCardButton;
  let fixture: ComponentFixture<JoinLeaveCardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinLeaveCardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinLeaveCardButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
