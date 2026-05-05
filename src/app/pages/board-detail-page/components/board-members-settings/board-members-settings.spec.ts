import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMembersSettings } from './board-members-settings';

describe('BoardMembersSettings', () => {
  let component: BoardMembersSettings;
  let fixture: ComponentFixture<BoardMembersSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardMembersSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMembersSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
