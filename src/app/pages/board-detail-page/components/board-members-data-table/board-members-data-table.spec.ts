import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMembersDataTable } from './board-members-data-table';

describe('BoardMembersDataTable', () => {
  let component: BoardMembersDataTable;
  let fixture: ComponentFixture<BoardMembersDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardMembersDataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMembersDataTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
