import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMemberActions } from './board-member-actions';

describe('BoardMemberActions', () => {
  let component: BoardMemberActions;
  let fixture: ComponentFixture<BoardMemberActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardMemberActions],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMemberActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
