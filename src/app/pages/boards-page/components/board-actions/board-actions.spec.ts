import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardActions } from './board-actions';

describe('BoardActions', () => {
  let component: BoardActions;
  let fixture: ComponentFixture<BoardActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardActions],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
